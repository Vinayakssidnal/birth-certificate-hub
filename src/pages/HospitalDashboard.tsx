import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import WalletButton from "@/components/WalletButton";
import { createBirthRecord, type BirthRecord } from "@/lib/blockchain";
import { useStore } from "@/lib/store";

const initialForm: BirthRecord = {
  fatherName: "",
  motherName: "",
  babyName: "",
  birthDate: "",
  birthTime: "",
  gender: "",
  permanentAddress: "",
  doctorName: "",
  hospitalAddress: "",
};

const fields: { key: keyof BirthRecord; label: string; type?: string; placeholder: string }[] = [
  { key: "fatherName", label: "Father Name", placeholder: "Enter father's full name" },
  { key: "motherName", label: "Mother Name", placeholder: "Enter mother's full name" },
  { key: "babyName", label: "Baby Name", placeholder: "Enter baby's name" },
  { key: "birthDate", label: "Birth Date", type: "date", placeholder: "" },
  { key: "birthTime", label: "Birth Time", type: "time", placeholder: "" },
  { key: "gender", label: "Gender", placeholder: "Male / Female / Other" },
  { key: "permanentAddress", label: "Permanent Address", placeholder: "Enter permanent address" },
  { key: "doctorName", label: "Doctor Name", placeholder: "Enter attending doctor's name" },
  { key: "hospitalAddress", label: "Hospital Address", placeholder: "Enter hospital name and address" },
];

export default function HospitalDashboard() {
  const [form, setForm] = useState<BirthRecord>(initialForm);
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [certId, setCertId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addRecord } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTxHash(null);
    setCertId(null);

    const missing = fields.filter((f) => !form[f.key].trim());
    if (missing.length > 0) {
      setError(`Please fill in: ${missing.map((f) => f.label).join(", ")}`);
      setLoading(false);
      return;
    }

    try {
      const hash = await createBirthRecord(form);
      const id = addRecord(form, hash);
      setTxHash(hash);
      setCertId(id);
      setForm(initialForm);
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
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Hospital Dashboard</h1>
            <p className="text-sm text-muted-foreground font-body">Create birth records on the blockchain</p>
          </div>
        </div>

        <div className="mb-6">
          <WalletButton />
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 shadow-card space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            {fields.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label className="text-sm font-medium text-card-foreground font-body">{f.label}</Label>
                <Input
                  type={f.type || "text"}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                  className="font-body"
                />
              </div>
            ))}
          </div>

          <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground font-body gap-2">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spinner" /> Processing Transaction...
              </>
            ) : (
              "Create Birth Record"
            )}
          </Button>
        </form>

        {txHash && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-xl border border-success/20 bg-success/5 p-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <h3 className="font-bold text-success font-body">Record Created Successfully!</h3>
            </div>
            <p className="text-xs text-muted-foreground font-body break-all">
              Certificate ID: <span className="font-mono text-foreground font-bold">#{certId}</span>
            </p>
            <p className="text-xs text-muted-foreground font-body break-all mt-1">
              Transaction Hash: <span className="font-mono text-foreground">{txHash}</span>
            </p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-xl border border-destructive/20 bg-destructive/5 p-5"
          >
            <p className="text-sm text-destructive font-body">{error}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
