
import { AppShell } from "@/components/app-shell";
import { ProfileForm } from "@/components/settings/profile-form";
import { NotificationsForm } from "@/components/settings/notifications-form";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-8 max-w-3xl mx-auto">
        <header>
          <h1 className="text-3xl font-headline font-bold tracking-tight">Profile & Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and notification preferences.
          </p>
        </header>

        <div className="space-y-6">
          <ProfileForm />
          <Separator />
          <NotificationsForm />
        </div>
      </div>
    </AppShell>
  );
}
