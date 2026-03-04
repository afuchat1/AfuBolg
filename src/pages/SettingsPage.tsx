import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { Camera, Save, User, LogOut } from "lucide-react";

const SettingsPage = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("display_name, bio, avatar_url")
      .eq("user_id", user.id)
      .maybeSingle();
    if (data) {
      setDisplayName(data.display_name || "");
      setBio((data as any).bio || "");
      setAvatarUrl((data as any).avatar_url || "");
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      toast.error("Upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const newUrl = urlData.publicUrl + "?t=" + Date.now();
    setAvatarUrl(newUrl);

    await supabase
      .from("profiles")
      .update({ avatar_url: newUrl } as any)
      .eq("user_id", user.id);

    toast.success("Avatar updated!");
    setUploading(false);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName, bio, avatar_url: avatarUrl } as any)
      .eq("user_id", user.id);

    if (error) toast.error(error.message);
    else toast.success("Profile saved!");
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    setChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) toast.error(error.message);
    else {
      toast.success("Password updated!");
      setNewPassword("");
      setConfirmPassword("");
    }
    setChangingPassword(false);
  };

  const handleDeleteAccount = async () => {
    toast.error("Please contact support to delete your account.");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead title="Settings" description="Manage your profile, avatar, and account settings." />
      <Header />

      <main className="flex-1 px-6 sm:px-10 lg:px-16 py-12">
        <div className="max-w-2xl mx-auto">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Dashboard", href: "/dashboard" }, { label: "Settings" }]} />

          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold mt-6 text-foreground">Profile Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Update your profile picture, display name, and bio.</p>

          {/* Avatar */}
          <div className="mt-10 flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden shrink-0 group">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={36} className="text-muted-foreground" />
              )}
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                <Camera size={20} className="text-white" />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Profile Photo</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {uploading ? "Uploading..." : "Hover and click to change (max 2MB)"}
              </p>
            </div>
          </div>

          {/* Profile Info */}
          <div className="mt-8 space-y-5">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-secondary text-foreground px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary rounded"
                placeholder="Your pen name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full bg-secondary text-foreground px-4 py-2.5 text-sm outline-none resize-none focus:ring-1 focus:ring-primary rounded"
                placeholder="Tell readers about yourself..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full bg-muted text-muted-foreground px-4 py-2.5 text-sm rounded cursor-not-allowed"
              />
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium rounded hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>

          {/* Password */}
          <div className="mt-12 pt-8 border-t border-border">
            <h2 className="font-heading text-lg font-bold text-foreground">Change Password</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-secondary text-foreground px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary rounded"
                  placeholder="Min 6 characters"
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-secondary text-foreground px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary rounded"
                  placeholder="Repeat new password"
                />
              </div>
              <button
                onClick={handleChangePassword}
                disabled={changingPassword || !newPassword}
                className="bg-foreground text-background px-6 py-2.5 text-sm font-medium rounded hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {changingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>

          {/* Sign Out */}
          <div className="mt-12 pt-8 border-t border-border">
            <h2 className="font-heading text-lg font-bold text-foreground">Session</h2>
            <p className="text-sm text-muted-foreground mt-1">Sign out of your account on this device.</p>
            <button
              onClick={() => { signOut(); navigate("/"); }}
              className="mt-4 flex items-center gap-2 border border-border text-foreground px-6 py-2.5 text-sm font-medium rounded hover:bg-secondary transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>

          {/* Danger Zone */}
          <div className="mt-12 pt-8 border-t border-destructive/20">
            <h2 className="font-heading text-lg font-bold text-destructive">Danger Zone</h2>
            <p className="text-sm text-muted-foreground mt-1">Once you delete your account, there is no going back.</p>
            <button
              onClick={handleDeleteAccount}
              className="mt-4 border border-destructive text-destructive px-6 py-2.5 text-sm font-medium rounded hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </main>

      <PageFooter pageName="Settings" relatedLinks={[{ label: "Dashboard", href: "/dashboard" }, { label: "Home", href: "/" }]} />
    </div>
  );
};

export default SettingsPage;
