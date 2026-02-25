import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Trash2, Plus, Shield } from "lucide-react";

const AdminManageAdmins = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchAdmins();
  }, [user]);

  const fetchAdmins = async () => {
    const { data, error } = await supabase.functions.invoke("manage-admins", {
      body: { action: "list" },
    });
    if (error) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    setIsAdmin(true);
    setAdmins(data || []);
    setLoading(false);
  };

  const addAdmin = async () => {
    if (!email.trim()) return;
    setAdding(true);
    const { data, error } = await supabase.functions.invoke("manage-admins", {
      body: { action: "add", email: email.trim() },
    });
    if (error || data?.error) {
      toast.error(data?.error || error?.message || "Failed to add admin");
    } else {
      toast.success("Admin added successfully");
      setEmail("");
      fetchAdmins();
    }
    setAdding(false);
  };

  const removeAdmin = async (roleId: string, userId: string) => {
    if (userId === user!.id) {
      toast.error("You cannot remove yourself as admin");
      return;
    }
    const { error } = await supabase.from("user_roles").delete().eq("id", roleId);
    if (error) toast.error(error.message);
    else {
      toast.success("Admin removed");
      fetchAdmins();
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Access denied. Admins only.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container max-w-2xl py-6">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Dashboard", href: "/admin" },
          { label: "Manage Admins" },
        ]} />
        <h1 className="font-heading text-2xl font-bold mt-2 mb-6 flex items-center gap-2">
          <Shield size={20} className="text-primary" /> Manage Admins
        </h1>

        {/* Add admin form */}
        <div className="flex gap-2 mb-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter user email..."
            className="flex-1 bg-secondary text-foreground px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={addAdmin}
            disabled={adding || !email.trim()}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Plus size={14} /> {adding ? "Adding..." : "Add Admin"}
          </button>
        </div>

        <div className="space-y-0">
          {admins.map((admin, i) => (
            <div key={admin.id}>
              {i > 0 && <div className="h-px bg-muted my-3" />}
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium">{admin.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">{admin.role}</p>
                </div>
                {admin.user_id !== user!.id && (
                  <button
                    onClick={() => removeAdmin(admin.id, admin.user_id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminManageAdmins;
