import { useState } from "react";
import { connectWallet } from "@/lib/blockchain";
import { useAuth, type UserRole } from "@/lib/auth";
import { Wallet, Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const roles: { value: UserRole; label: string }[] = [
  { value: "hospital", label: "Hospital" },
  { value: "registrar", label: "Government (Registrar)" },
  { value: "public", label: "Public User" },
];

export default function WalletButton() {
  const { isAuthenticated, address, role, login, logout } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>("hospital");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      const state = await connectWallet();
      if (!state.address) throw new Error("No address returned");
      await login(state.address, selectedRole);
      toast.success(`Logged in as ${selectedRole}`);
    } catch (e: any) {
      setError(e.message);
      toast.error(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg bg-success/10 border border-success/20 px-4 py-2.5 text-sm font-body">
          <div className="h-2 w-2 rounded-full bg-success" />
          <span className="text-success font-medium">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <span className="text-muted-foreground text-xs ml-1 capitalize">({role})</span>
        </div>
        <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground font-body gap-1">
          <LogOut className="h-3.5 w-3.5" /> Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        {roles.map((r) => (
          <button
            key={r.value}
            onClick={() => setSelectedRole(r.value)}
            className={`rounded-lg px-4 py-2 text-sm font-body font-medium transition-all border ${
              selectedRole === r.value
                ? "gradient-primary text-primary-foreground border-transparent shadow-glow"
                : "bg-card text-muted-foreground border-border hover:border-primary/30"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
      <Button
        onClick={handleConnect}
        disabled={loading}
        className="gradient-primary text-primary-foreground font-body gap-2"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spinner" /> : <Wallet className="h-4 w-4" />}
        {loading ? "Connecting..." : "Connect & Login"}
      </Button>
      {error && <p className="text-xs text-destructive font-body">{error}</p>}
    </div>
  );
}
