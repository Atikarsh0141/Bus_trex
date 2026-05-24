
'use client';

import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useUser, useAuth, useFirestore } from '@/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2, User as UserIcon, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadProfilePicture } from '@/app/actions';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function ProfileImageUploader() {
  const { user, isUserLoading, reload } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Set initial preview URL from the user's current photoURL
    if (user?.photoURL) {
      setPreviewUrl(user.photoURL);
    } else {
      setPreviewUrl(null);
    }
  }, [user?.photoURL]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please select an image file.' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ variant: 'destructive', title: 'File Too Large', description: 'Please select an image smaller than 5MB.' });
        return;
      }
      
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user || !auth || !firestore) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append('profilePicture', selectedFile);

    const result = await uploadProfilePicture(formData);

    if ('error' in result) {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: result.error,
      });
      setIsUploading(false);
      // Revert preview if upload fails
      setPreviewUrl(user?.photoURL || null); 
      setSelectedFile(null);
      return;
    }

    const { downloadURL } = result;

    try {
      // Update Firebase Auth profile first
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: downloadURL });
      }
      
      // Then update Firestore document
      const userRef = doc(firestore, 'users', user.uid);
      
      await setDoc(userRef, { photoURL: downloadURL }, { merge: true })
        .catch(serverError => {
            const contextualError = new FirestorePermissionError({
              path: userRef.path,
              operation: 'update',
              requestResourceData: { photoURL: downloadURL },
            });
            errorEmitter.emit('permission-error', contextualError);
            throw new Error('Failed to save profile picture link.');
        });

      // Force a reload of the user to get the latest photoURL from the provider
      await reload();

      toast({
        title: 'Profile Picture Updated',
        description: 'Your new photo has been saved.',
      });
      setSelectedFile(null); // Clear selection after successful upload
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'Could not update your profile with the new photo.',
      });
      // Revert preview if update fails
      setPreviewUrl(user?.photoURL || null);
    } finally {
      setIsUploading(false);
    }
  };

  const getInitials = () => {
    if (user?.displayName) {
      return user.displayName.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return <UserIcon className="h-8 w-8" />;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="h-32 w-32 border-4 border-primary/50 shadow-md">
          <AvatarImage src={previewUrl || ''} alt={user?.displayName || 'User profile picture'} />
          <AvatarFallback className="text-3xl bg-muted">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/gif"
        className="hidden"
      />

      {selectedFile ? (
        <div className="flex items-center gap-2">
          <Button onClick={handleUpload} disabled={isUploading}>
            <Upload className="mr-2 h-4 w-4" />
            Save Photo
          </Button>
          <Button variant="ghost" size="icon" onClick={() => {
            setSelectedFile(null);
            setPreviewUrl(user?.photoURL || null);
          }}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button 
          variant="outline" 
          onClick={() => fileInputRef.current?.click()} 
          disabled={isUserLoading || isUploading}
        >
          Change Photo
        </Button>
      )}
    </div>
  );
}
