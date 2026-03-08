import { useState } from "react";
import { connectWallet, type WalletState } from "@/lib/blockchain";
import { Wallet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WalletButton() {
  const [wallet, setWallet] = useState<WalletState>({ address: null, connected: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      const state = await connectWallet();
      setWallet(state);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (wallet.connected && wallet.address) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-success/10 border border-success/20 px-4 py-2.5 text-sm font-body">
        <div className="h-2 w-2 rounded-full bg-success" />
        <span className="text-success font-medium">
          {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handleConnect}
        disabled={loading}
        className="gradient-primary text-primary-foreground font-body gap-2"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spinner" /> : <Wallet className="h-4 w-4" />}
        {loading ? "Connecting..." : "Connect MetaMask"}
      </Button>
      {error && <p className="text-xs text-destructive font-body">{error}</p>}
    </div>
  );
}
