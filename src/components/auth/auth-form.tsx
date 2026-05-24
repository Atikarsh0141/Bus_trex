
"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth, useFirestore } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  UserCredential,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { FirebaseError } from "firebase/app";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().optional(),
  age: z.coerce.number().optional(),
  gender: z.enum(["Male", "Female", "Other", "Prefer not to say"]).optional(),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type UserFormValue = z.infer<typeof formSchema>;

export function AuthForm() {
  const [isPending, startTransition] = useTransition();
  const [isGooglePending, startGoogleTransition] = useTransition();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      age: undefined,
      gender: undefined,
    },
  });

  const saveUserToFirestore = (userCred: UserCredential, data: Partial<UserFormValue>) => {
    if (!firestore || !userCred.user) return;
    
    const userDocRef = doc(firestore, "users", userCred.user.uid);
    const userData = {
        id: userCred.user.uid,
        email: userCred.user.email,
        name: data.name || userCred.user.displayName,
        age: data.age,
        gender: data.gender,
        role: "passenger"
    };

    setDoc(userDocRef, userData, { merge: true })
      .catch(serverError => {
        const contextualError = new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'create',
          requestResourceData: userData,
        });
        errorEmitter.emit('permission-error', contextualError);
        setError("Could not save user profile. Please try again.");
      });
  };

  const onSubmit = (data: UserFormValue) => {
    setError(null);
    startTransition(async () => {
      if (!auth) {
          setError("Authentication service is not available. Please try again later.");
          return;
      }
      try {
        const nextUrl = searchParams.get('next') || '/dashboard';
        if (isLogin) {
          await signInWithEmailAndPassword(auth, data.email, data.password);
          router.push(nextUrl);
        } else {
          // Validate signup fields
          if (!data.name || !data.age || !data.gender) {
              setError("Please fill out all fields for sign up.");
              return;
          }
          const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
          
          await updateProfile(userCredential.user, { displayName: data.name });

          saveUserToFirestore(userCredential, data);
          router.push("/onboarding");
        }
      } catch (e) {
        if (e instanceof FirebaseError) {
          switch (e.code) {
            case 'auth/user-not-found':
            case 'auth/invalid-credential':
              setError("Incorrect email or password. Please try again.");
              break;
            case 'auth/wrong-password':
              setError("Incorrect password. Please try again.");
              break;
            case 'auth/email-already-in-use':
                setError("An account already exists with this email.");
                break;
            case 'auth/weak-password':
                setError("The password is too weak.");
                break;
            default:
              setError("An unexpected error occurred. Please try again.");
              break;
          }
        } else {
            setError("An unexpected error occurred. Please try again.");
        }
      }
    });
  };

  const handlePasswordReset = () => {
    const email = form.getValues("email");
    if (!email) {
      setError("Please enter your email address to reset your password.");
      return;
    }
    if (!auth) {
      setError("Authentication service is not available.");
      return;
    }

    startTransition(async () => {
      setError(null);
      try {
        await sendPasswordResetEmail(auth, email);
        toast({
          title: "Password Reset Email Sent",
          description: "Check your inbox for a link to reset your password.",
        });
      } catch (e) {
        if (e instanceof FirebaseError) {
          if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-email') {
            setError("Could not find an account with that email address.");
          } else {
            setError("An error occurred. Please try again.");
          }
        } else {
          setError("An unexpected error occurred.");
        }
      }
    });
  };

  const handleGoogleSignIn = () => {
    setError(null);
    startGoogleTransition(async () => {
      if (!auth || !firestore) {
          setError("Authentication service is not available. Please try again later.");
          return;
      }
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const userDocRef = doc(firestore, "users", user.uid);
        const nextUrl = searchParams.get('next') || '/dashboard';
        
        const docSnap = await getDoc(userDocRef);

        if (!docSnap.exists()) {
          saveUserToFirestore(result, {role: "passenger"});
          router.push("/onboarding");
        } else {
          router.push(nextUrl);
        }

      } catch (error) {
        if (error instanceof FirebaseError) {
            console.error("Google Sign-In Error:", error.code, error.message);
            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    // Don't show an error, user simply closed the popup
                    break;
                case 'auth/account-exists-with-different-credential':
                    setError("An account already exists with this email. Please sign in with your original method.");
                    break;
                case 'auth/operation-not-allowed':
                    setError("Google Sign-In is not enabled for this project. Please contact support.");
                    break;
                default:
                    setError("Failed to sign in with Google. Please try again.");
            }
        } else {
            setError("An unexpected error occurred during Google sign-in.");
        }
      }
    });
  };

  return (
    <Card>
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-headline">{isLogin ? "Welcome Back" : "Create an Account"}</CardTitle>
        <CardDescription>
          {isLogin ? "Log in to access your dashboard" : "Enter your details to get started"}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
             <div className="grid grid-cols-1">
              <Button variant="outline" type="button" disabled={isPending || isGooglePending} onClick={handleGoogleSignIn}>
                {isGooglePending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 173.4 56.6l-67.2 64.9C314.1 95.8 282.5 80 248 80c-73.2 0-132.3 59.8-132.3 133.1s59.1 133.1 132.3 133.1c76.3 0 119.3-31.4 124.8-73.1H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path></svg>
                )}
                {isLogin ? "Sign in with Google" : "Sign up with Google"}
              </Button>
            </div>
             <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            {!isLogin && (
                <>
                    <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: !isLogin }}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input
                            placeholder="John Doe"
                            disabled={isPending || isGooglePending}
                            {...field}
                             value={field.value ?? ''}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                        control={form.control}
                        name="age"
                        rules={{ required: !isLogin }}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                                <Input
                                type="number"
                                placeholder="25"
                                disabled={isPending || isGooglePending}
                                {...field}
                                value={field.value ?? ''}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="gender"
                        rules={{ required: !isLogin }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending || isGooglePending}>
                                <FormControl>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Select..." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                </>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      disabled={isPending || isGooglePending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                    <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        {isLogin && (
                             <button
                                type="button"
                                className="text-sm font-medium text-primary hover:underline underline-offset-4"
                                onClick={handlePasswordReset}
                                disabled={isPending}
                            >
                                Forgot password?
                            </button>
                        )}
                    </div>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        disabled={isPending || isGooglePending}
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
                <p className="text-sm font-medium text-destructive">{error}</p>
            )}

          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button disabled={isPending || isGooglePending} className="w-full">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? "Log In" : "Sign Up"}
            </Button>
             <p className="text-center text-sm text-muted-foreground">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                className="underline underline-offset-4 hover:text-primary"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                  form.reset();
                }}
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
