import { motion } from "framer-motion";
import {
  Activity, FileText, CheckCircle2, ShieldCheck, Clock,
  Building2, UserCheck, Filter, AlertCircle
} from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";

type ActivityType = "all" | "create" | "approve" | "verify";

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
  const { activities } = useStore();

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
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-card shadow-card p-12 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground font-body">No activity yet. Start by creating a birth record from the Hospital Dashboard.</p>
          </div>
        ) : (
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
                          <span className="font-mono text-primary/70">Tx: {item.txHash.slice(0, 18)}...</span>
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
        )}
      </motion.div>
    </div>
  );
}
