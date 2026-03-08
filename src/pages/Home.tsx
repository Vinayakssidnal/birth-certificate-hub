import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Building2, UserCheck, ShieldCheck, FileText } from "lucide-react";

const cards = [
  {
    title: "Hospital Dashboard",
    description: "Create and submit birth records to the blockchain for permanent, tamper-proof storage.",
    icon: Building2,
    path: "/hospital",
    color: "from-primary to-accent",
  },
  {
    title: "Registrar Dashboard",
    description: "Review pending birth certificates and approve them through blockchain verification.",
    icon: UserCheck,
    path: "/registrar",
    color: "from-accent to-primary",
  },
  {
    title: "Verify Certificate",
    description: "Verify the authenticity and status of any birth certificate on the blockchain.",
    icon: ShieldCheck,
    path: "/verify",
    color: "from-success to-accent",
  },
];

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary font-body mb-6">
          <FileText className="h-3.5 w-3.5" />
          Blockchain Powered
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
          Birth Certificate System
        </h1>
        <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
          A decentralized, transparent, and tamper-proof system for managing birth certificates using Ethereum blockchain technology.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card, i) => (
          <motion.div
            key={card.path}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 * i }}
          >
            <Link
              to={card.path}
              className="group block rounded-xl border border-border bg-card p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${card.color} mb-4`}
              >
                <card.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold text-card-foreground mb-2 font-display">
                {card.title}
              </h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                {card.description}
              </p>
              <div className="mt-4 text-sm font-medium text-primary font-body group-hover:underline">
                Open Dashboard →
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-16 grid grid-cols-3 gap-6 rounded-xl gradient-hero p-8 text-center"
      >
        {[
          { label: "Certificates Issued", value: "12,847" },
          { label: "Verified Records", value: "11,293" },
          { label: "Active Hospitals", value: "156" },
        ].map((stat) => (
          <div key={stat.label}>
            <p className="text-2xl lg:text-3xl font-bold text-primary-foreground font-display">{stat.value}</p>
            <p className="text-xs text-primary-foreground/60 font-body mt-1">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
