import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";
import SEOHead from "@/components/SEOHead";
import { KeyRound } from "lucide-react";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for recovery event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    // Also check hash for type=recovery
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setReady(true);
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated! You can now sign in.");
      navigate("/auth");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead title="Reset Password" description="Set a new password for your AfuBlog account." />
      <Header />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <KeyRound size={40} className="mx-auto text-primary mb-4" />
            <h1 className="font-heading text-3xl font-bold mb-2">Reset Password</h1>
            <p className="text-sm text-muted-foreground">
              {ready ? "Enter your new password below." : "Loading recovery session..."}
            </p>
          </div>

          {ready ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-secondary text-foreground px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary rounded"
                  placeholder="Min 6 characters"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-secondary text-foreground px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary rounded"
                  placeholder="Repeat password"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-2.5 text-sm font-medium rounded hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Updating..." : "Set New Password"}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">If you didn't receive a reset link, go back to sign in and request one.</p>
            </div>
          )}
        </div>
      </div>
      <PageFooter pageName="Reset Password" relatedLinks={[{ label: "Sign In", href: "/auth" }]} />
    </div>
  );
};

export default ResetPasswordPage;
