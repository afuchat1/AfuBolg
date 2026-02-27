import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";
import { PenSquare, ArrowRight } from "lucide-react";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <PenSquare size={40} className="mx-auto text-primary mb-4" />
            <h1 className="font-heading text-3xl font-bold mb-2">
              {isLogin ? "Welcome Back" : "Join AfuBlog"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLogin
                ? "Sign in to your writing dashboard"
                : "Create an account and start sharing your stories with the AfuChat community"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Display name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-secondary text-foreground px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary rounded"
                  placeholder="Your pen name"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-secondary text-foreground px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary rounded"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Password</label>
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
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 rounded"
            >
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:opacity-80 transition-opacity"
            >
              {isLogin ? "Don't have an account? Sign up free" : "Already have an account? Sign in"}
            </button>
          </div>

          {!isLogin && (
            <p className="mt-6 text-xs text-muted-foreground text-center leading-relaxed">
              By signing up, you agree to our Terms of Service. Your articles will be reviewed before publishing on the main feed.
            </p>
          )}
        </div>
      </div>
      <PageFooter pageName="Auth" relatedLinks={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }]} />
    </div>
  );
};

export default AuthPage;
