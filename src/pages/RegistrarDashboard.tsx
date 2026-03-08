import { useState } from "react";
import { motion } from "framer-motion";
import { UserCheck, CheckCircle2, Loader2, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import WalletButton from "@/components/WalletButton";
import { approveCertificate } from "@/lib/blockchain";
import { useStore } from "@/lib/store";

export default function RegistrarDashboard() {
  const [certId, setCertId] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { records, approveRecord } = useStore();

  const handleApprove = async () => {
    if (!certId.trim()) {
      setError("Please enter a Certificate ID");
      return;
    }
    setLoading(true);
    setError(null);
    setTxHash(null);
    try {
      const hash = await approveCertificate(Number(certId));
      approveRecord(Number(certId), hash);
      setTxHash(hash);
      setCertId("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
            <UserCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Registrar Dashboard</h1>
            <p className="text-sm text-muted-foreground font-body">Approve birth certificates on the blockchain</p>
          </div>
        </div>

        <div className="mb-6">
          <WalletButton />
        </div>

        {/* Approve form */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card mb-6">
          <Label className="text-sm font-medium text-card-foreground font-body">Certificate ID</Label>
          <div className="flex gap-3 mt-2">
            <Input
              type="number"
              placeholder="Enter Certificate ID"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              className="font-body max-w-xs"
            />
            <Button
              onClick={handleApprove}
              disabled={loading}
              className="gradient-primary text-primary-foreground font-body gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spinner" /> : null}
              {loading ? "Approving..." : "Approve Certificate"}
            </Button>
          </div>
        </div>

        {txHash && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl border border-success/20 bg-success/5 p-5"
          >
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <h3 className="font-bold text-success font-body">Certificate Approved!</h3>
            </div>
            <p className="text-xs text-muted-foreground font-body break-all">
              Transaction Hash: <span className="font-mono text-foreground">{txHash}</span>
            </p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl border border-destructive/20 bg-destructive/5 p-5"
          >
            <p className="text-sm text-destructive font-body">{error}</p>
          </motion.div>
        )}

        {/* Table */}
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-bold text-card-foreground font-body">Certificate Records</h3>
          </div>
          {records.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground font-body">No records yet. Create a birth record from the Hospital Dashboard first.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground font-body uppercase tracking-wider">Certificate ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground font-body uppercase tracking-wider">Baby Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground font-body uppercase tracking-wider">Hospital</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground font-body uppercase tracking-wider">Birth Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground font-body uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((cert) => (
                    <tr key={cert.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-card-foreground">#{cert.id}</td>
                      <td className="px-6 py-4 text-sm font-body text-card-foreground">{cert.record.babyName}</td>
                      <td className="px-6 py-4 text-sm font-body text-muted-foreground">{cert.record.hospitalAddress}</td>
                      <td className="px-6 py-4 text-sm font-body text-muted-foreground">{cert.record.birthDate}</td>
                      <td className="px-6 py-4">
                        {cert.status === "Approved" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success font-body">
                            <CheckCircle2 className="h-3 w-3" /> Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-3 py-1 text-xs font-medium text-warning font-body">
                            <Clock className="h-3 w-3" /> Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
