import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Search, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { verifyCertificate, type CertificateData } from "@/lib/blockchain";

export default function VerifyCertificate() {
  const [certId, setCertId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CertificateData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!certId.trim()) {
      setError("Please enter a Certificate ID");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await verifyCertificate(Number(certId));
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const infoRows = result
    ? [
        { label: "Father Name", value: result.fatherName },
        { label: "Mother Name", value: result.motherName },
        { label: "Baby Name", value: result.babyName },
        { label: "Birth Date", value: result.birthDate },
        { label: "Hospital", value: result.hospital },
      ]
    : [];

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Verify Certificate</h1>
            <p className="text-sm text-muted-foreground font-body">Check authenticity of any birth certificate</p>
          </div>
        </div>

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
              onClick={handleVerify}
              disabled={loading}
              className="gradient-primary text-primary-foreground font-body gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spinner" /> : <Search className="h-4 w-4" />}
              {loading ? "Verifying..." : "Verify Certificate"}
            </Button>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl border border-destructive/20 bg-destructive/5 p-5"
          >
            <p className="text-sm text-destructive font-body">{error}</p>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card shadow-card overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-card-foreground font-body">Certificate Details</h3>
              {result.verified ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success font-body">
                  <CheckCircle2 className="h-3 w-3" /> Verified & Approved
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-3 py-1 text-xs font-medium text-warning font-body">
                  <XCircle className="h-3 w-3" /> Pending Approval
                </span>
              )}
            </div>
            <div className="divide-y divide-border">
              {infoRows.map((row) => (
                <div key={row.label} className="flex items-center px-6 py-4">
                  <span className="w-40 text-sm text-muted-foreground font-body">{row.label}</span>
                  <span className="text-sm font-medium text-card-foreground font-body">{row.value}</span>
                </div>
              ))}
              <div className="flex items-center px-6 py-4">
                <span className="w-40 text-sm text-muted-foreground font-body">Status</span>
                <span
                  className={`text-sm font-bold font-body ${
                    result.verified ? "text-success" : "text-warning"
                  }`}
                >
                  {result.status}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
