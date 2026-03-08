import { motion } from "framer-motion";
import {
  Activity, FileText, CheckCircle2, ShieldCheck, Clock,
  Building2, UserCheck, Filter
} from "lucide-react";
import { useState } from "react";

type ActivityType = "all" | "create" | "approve" | "verify";

const activities = [
  {
    id: 1, type: "create" as const, title: "Birth Record Created",
    description: "Hospital City General submitted birth record for Baby Aarav Kumar",
    txHash: "0xa1b2c3...7890", certId: 1047, block: 4821093,
    actor: "0x742d...35Cc", actorRole: "Hospital",
    time: "2 minutes ago", date: "March 8, 2026",
  },
  {
    id: 2, type: "approve" as const, title: "Certificate Approved",
    description: "Registrar Office approved birth certificate #1045 for Baby Priya Patel",
    txHash: "0xf9e8d7...fedc", certId: 1045, block: 4821092,
    actor: "0x8Ba1...92Fd", actorRole: "Registrar",
    time: "8 minutes ago", date: "March 8, 2026",
  },
  {
    id: 3, type: "verify" as const, title: "Certificate Verified",
    description: "Public verification request for certificate #1039 — Status: Approved",
    txHash: "—", certId: 1039, block: 4821091,
    actor: "0x3Ac7...41Ee", actorRole: "Public",
    time: "15 minutes ago", date: "March 8, 2026",
  },
  {
    id: 4, type: "create" as const, title: "Birth Record Created",
    description: "Hospital Sunrise Medical submitted birth record for Baby Rohan Sharma",
    txHash: "0xdead...9abc", certId: 1046, block: 4821090,
    actor: "0x5dF2...78Ab", actorRole: "Hospital",
    time: "22 minutes ago", date: "March 8, 2026",
  },
  {
    id: 5, type: "approve" as const, title: "Certificate Approved",
    description: "Registrar Office approved birth certificate #1042 for Baby Neha Gupta",
    txHash: "0xabcd...dead", certId: 1042, block: 4821089,
    actor: "0x8Ba1...92Fd", actorRole: "Registrar",
    time: "35 minutes ago", date: "March 8, 2026",
  },
  {
    id: 6, type: "create" as const, title: "Birth Record Created",
    description: "Hospital Metro Health submitted birth record for Baby Arjun Singh",
    txHash: "0x5678...1234", certId: 1044, block: 4821087,
    actor: "0x742d...35Cc", actorRole: "Hospital",
    time: "1 hour ago", date: "March 8, 2026",
  },
  {
    id: 7, type: "verify" as const, title: "Certificate Verified",
    description: "Public verification request for certificate #1035 — Status: Approved",
    txHash: "—", certId: 1035, block: 4821085,
    actor: "0x9Cd3...56Bb", actorRole: "Public",
    time: "1.5 hours ago", date: "March 8, 2026",
  },
  {
    id: 8, type: "approve" as const, title: "Certificate Approved",
    description: "Registrar Office approved birth certificate #1040 for Baby Kavya Reddy",
    txHash: "0x9012...5678", certId: 1040, block: 4821083,
    actor: "0x8Ba1...92Fd", actorRole: "Registrar",
    time: "2 hours ago", date: "March 8, 2026",
  },
];

const typeConfig = {
  create: { icon: FileText, color: "bg-primary/10 text-primary", badge: "bg-primary/10 text-primary" },
  approve: { icon: CheckCircle2, color: "bg-success/10 text-success", badge: "bg-success/10 text-success" },
  verify: { icon: ShieldCheck, color: "bg-accent/10 text-accent", badge: "bg-accent/10 text-accent" },
};

const roleIcons = {
  Hospital: Building2,
  Registrar: UserCheck,
  Public: ShieldCheck,
};

export default function ActivityLog() {
  const [filter, setFilter] = useState<ActivityType>("all");

  const filtered = filter === "all" ? activities : activities.filter((a) => a.type === filter);

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Activity Log</h1>
            <p className="text-sm text-muted-foreground font-body">All blockchain transactions and events</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Records Created", value: activities.filter((a) => a.type === "create").length, icon: FileText, color: "text-primary" },
            { label: "Certificates Approved", value: activities.filter((a) => a.type === "approve").length, icon: CheckCircle2, color: "text-success" },
            { label: "Verifications", value: activities.filter((a) => a.type === "verify").length, icon: ShieldCheck, color: "text-accent" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-card flex items-center gap-3">
              <s.icon className={`h-8 w-8 ${s.color}`} />
              <div>
                <p className="text-xl font-bold text-card-foreground font-display">{s.value}</p>
                <p className="text-xs text-muted-foreground font-body">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {(["all", "create", "approve", "verify"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium font-body capitalize transition-all ${
                filter === f
                  ? "gradient-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {filtered.map((item, i) => {
            const config = typeConfig[item.type];
            const RoleIcon = roleIcons[item.actorRole as keyof typeof roleIcons] || ShieldCheck;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card shadow-card overflow-hidden"
              >
                <div className="flex items-start gap-4 p-5">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.color}`}>
                    <config.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-card-foreground font-body">{item.title}</h3>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium font-body ${config.badge}`}>
                        {item.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground font-body mb-3">{item.description}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-body">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {item.time}
                      </span>
                      <span className="font-mono">Block #{item.block}</span>
                      <span className="font-mono">Cert #{item.certId}</span>
                      {item.txHash !== "—" && (
                        <span className="font-mono text-primary/70">Tx: {item.txHash}</span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <RoleIcon className="h-3 w-3" /> {item.actorRole}: <span className="font-mono">{item.actor}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
