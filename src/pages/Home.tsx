import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Building2, UserCheck, ShieldCheck, FileText, Blocks, ArrowRight,
  Lock, Globe, Database, Cpu, Network, Hash, Box, Activity,
  Clock, CheckCircle2, AlertCircle
} from "lucide-react";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import WalletButton from "@/components/WalletButton";

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

const howItWorks = [
  {
    step: "01",
    title: "Hospital Records Birth",
    description: "The hospital fills out birth details and submits them as a transaction to the Ethereum smart contract.",
    icon: Building2,
  },
  {
    step: "02",
    title: "Blockchain Stores Data",
    description: "The birth record is permanently stored on the Ethereum blockchain — immutable and tamper-proof.",
    icon: Blocks,
  },
  {
    step: "03",
    title: "Registrar Approves",
    description: "A government registrar reviews the record on-chain and approves it via a blockchain transaction.",
    icon: UserCheck,
  },
  {
    step: "04",
    title: "Anyone Can Verify",
    description: "Any party can verify the certificate's authenticity by querying the smart contract with its ID.",
    icon: ShieldCheck,
  },
];

const blockchainFeatures = [
  {
    icon: Lock,
    title: "Immutable Records",
    description: "Once written, birth records cannot be altered, deleted, or forged by anyone.",
  },
  {
    icon: Globe,
    title: "Decentralized",
    description: "No single point of failure. Data is distributed across thousands of Ethereum nodes worldwide.",
  },
  {
    icon: Database,
    title: "Transparent",
    description: "All transactions are publicly auditable on the Ethereum blockchain explorer.",
  },
  {
    icon: Cpu,
    title: "Smart Contract",
    description: "Business logic is encoded in a Solidity smart contract, ensuring automated trustless execution.",
  },
];

const networkInfo = {
  network: "Ethereum (Sepolia Testnet)",
  chainId: "11155111",
  contractAddress: "0xYOUR_CONTRACT_ADDRESS_HERE",
  consensusMechanism: "Proof of Stake (PoS)",
  blockTime: "~12 seconds",
  gasToken: "ETH (SepoliaETH)",
};

export default function HomePage() {
  const { records, activities } = useStore();
  const { isAuthenticated, role } = useAuth();

  const totalCreated = activities.filter((a) => a.type === "create").length;
  const totalApproved = activities.filter((a) => a.type === "approve").length;
  const totalVerified = activities.filter((a) => a.type === "verify").length;

  const recentActivity = activities.slice(0, 5);

  const activityIcon = (type: string) => {
    switch (type) {
      case "create": return FileText;
      case "approve": return CheckCircle2;
      case "verify": return ShieldCheck;
      default: return FileText;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary font-body mb-6">
          <FileText className="h-3.5 w-3.5" />
          Blockchain Powered · Ethereum · Solidity
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
          Birth Certificate System
        </h1>
        <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
          A decentralized, transparent, and tamper-proof system for managing birth certificates using Ethereum blockchain technology.
        </p>

        {/* Login Section */}
        <div className="mt-8 inline-block">
          <WalletButton />
        </div>
      </motion.div>

      {/* Navigation Cards */}
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
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${card.color} mb-4`}>
                <card.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold text-card-foreground mb-2 font-display">{card.title}</h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">{card.description}</p>
              <div className="mt-4 text-sm font-medium text-primary font-body group-hover:underline inline-flex items-center gap-1">
                Open Dashboard <ArrowRight className="h-3.5 w-3.5" />
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
        className="grid grid-cols-2 md:grid-cols-4 gap-6 rounded-xl gradient-hero p-8 text-center"
      >
        {[
          { label: "Certificates Issued", value: totalCreated.toString(), icon: FileText },
          { label: "Approved Records", value: totalApproved.toString(), icon: ShieldCheck },
          { label: "Verifications", value: totalVerified.toString(), icon: CheckCircle2 },
          { label: "Total Transactions", value: activities.length.toString(), icon: Box },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center">
            <stat.icon className="h-5 w-5 text-primary-foreground/60 mb-2" />
            <p className="text-2xl lg:text-3xl font-bold text-primary-foreground font-display">{stat.value}</p>
            <p className="text-xs text-primary-foreground/60 font-body mt-1">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* How It Works */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-2">How It Works</h2>
          <p className="text-muted-foreground font-body">End-to-end blockchain-secured certificate lifecycle</p>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {howItWorks.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i + 0.4 }}
              className="relative rounded-xl border border-border bg-card p-6 shadow-card text-center"
            >
              <div className="text-4xl font-bold text-primary/10 font-display absolute top-3 right-4">{item.step}</div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-sm font-bold text-card-foreground mb-2 font-body">{item.title}</h3>
              <p className="text-xs text-muted-foreground font-body leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Blockchain Features */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-2">Why Blockchain?</h2>
          <p className="text-muted-foreground font-body">Key advantages of decentralized certificate management</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {blockchainFeatures.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i + 0.5 }}
              className="flex gap-4 rounded-xl border border-border bg-card p-6 shadow-card"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg gradient-primary">
                <feat.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-card-foreground mb-1 font-body">{feat.title}</h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">{feat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Blockchain Network Details + Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Network Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl border border-border bg-card shadow-card overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-border flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-card-foreground font-body">Blockchain Network Details</h3>
          </div>
          <div className="divide-y divide-border">
            {[
              { label: "Network", value: networkInfo.network },
              { label: "Chain ID", value: networkInfo.chainId },
              { label: "Consensus", value: networkInfo.consensusMechanism },
              { label: "Avg Block Time", value: networkInfo.blockTime },
              { label: "Gas Token", value: networkInfo.gasToken },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between px-6 py-3">
                <span className="text-sm text-muted-foreground font-body">{row.label}</span>
                <span className="text-sm font-medium text-card-foreground font-mono">{row.value}</span>
              </div>
            ))}
            <div className="px-6 py-3">
              <span className="text-sm text-muted-foreground font-body block mb-1">Contract Address</span>
              <span className="text-xs font-medium text-primary font-mono break-all">{networkInfo.contractAddress}</span>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="rounded-xl border border-border bg-card shadow-card overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-border flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-card-foreground font-body">Recent Activity</h3>
          </div>
          {recentActivity.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <AlertCircle className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground font-body">No activity yet. Start by creating a birth record.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentActivity.map((item) => {
                const Icon = activityIcon(item.type);
                return (
                  <div key={item.id} className="flex items-center gap-3 px-6 py-3">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      item.type === "create" ? "bg-primary/10" :
                      item.type === "approve" ? "bg-success/10" : "bg-accent/10"
                    }`}>
                      <Icon className={`h-4 w-4 ${
                        item.type === "create" ? "text-primary" :
                        item.type === "approve" ? "text-success" : "text-accent"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-card-foreground font-body truncate">{item.description}</p>
                      <p className="text-xs text-muted-foreground font-body">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Smart Contract Architecture */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-xl border border-border bg-card shadow-card overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <Hash className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-card-foreground font-body">Smart Contract Architecture</h3>
        </div>
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-muted/30 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <h4 className="text-sm font-bold text-card-foreground font-body">createBirthRecord()</h4>
              </div>
              <p className="text-xs text-muted-foreground font-body leading-relaxed mb-3">
                Called by hospitals. Accepts 9 parameters (father, mother, baby name, etc.) and stores them on-chain. Returns a unique certificate ID.
              </p>
              <div className="text-xs font-mono text-primary/70 bg-primary/5 rounded p-2">
                Caller: Hospital Address<br/>
                Gas: ~120,000 units<br/>
                Returns: uint256 certId
              </div>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-3 w-3 rounded-full bg-success" />
                <h4 className="text-sm font-bold text-card-foreground font-body">approveCertificate()</h4>
              </div>
              <p className="text-xs text-muted-foreground font-body leading-relaxed mb-3">
                Called by authorized registrar. Takes a certificate ID and marks it as approved. Only callable by registrar role.
              </p>
              <div className="text-xs font-mono text-success/70 bg-success/5 rounded p-2">
                Caller: Registrar Address<br/>
                Gas: ~45,000 units<br/>
                Access: Registrar Only
              </div>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-3 w-3 rounded-full bg-accent" />
                <h4 className="text-sm font-bold text-card-foreground font-body">verifyCertificate()</h4>
              </div>
              <p className="text-xs text-muted-foreground font-body leading-relaxed mb-3">
                Read-only function. Accepts a certificate ID and returns all stored data plus approval status. No gas required.
              </p>
              <div className="text-xs font-mono text-accent/70 bg-accent/5 rounded p-2">
                Caller: Anyone<br/>
                Gas: 0 (view function)<br/>
                Returns: Certificate Data
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tech Stack */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="rounded-xl gradient-hero p-8"
      >
        <h2 className="text-2xl font-bold text-primary-foreground mb-6 text-center">Technology Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { name: "Ethereum", desc: "Blockchain Network" },
            { name: "Solidity", desc: "Smart Contract Language" },
            { name: "Ethers.js", desc: "Blockchain Library" },
            { name: "MetaMask", desc: "Wallet Provider" },
          ].map((tech) => (
            <div key={tech.name} className="rounded-lg bg-primary-foreground/10 backdrop-blur-sm p-4">
              <p className="text-sm font-bold text-primary-foreground font-body">{tech.name}</p>
              <p className="text-xs text-primary-foreground/60 font-body mt-1">{tech.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Blockchain Data Flow Diagram */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="rounded-xl border border-border bg-card shadow-card p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Blocks className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-card-foreground font-body">Data Flow on Blockchain</h3>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {[
            { label: "Hospital", sublabel: "Creates Record", icon: Building2, color: "bg-primary/10 text-primary" },
            { label: "Ethereum Network", sublabel: "Validates & Stores", icon: Blocks, color: "bg-accent/10 text-accent" },
            { label: "Smart Contract", sublabel: "Processes Logic", icon: Cpu, color: "bg-warning/10 text-warning" },
            { label: "Registrar", sublabel: "Approves Certificate", icon: UserCheck, color: "bg-success/10 text-success" },
            { label: "Public", sublabel: "Verifies On-Chain", icon: ShieldCheck, color: "bg-primary/10 text-primary" },
          ].map((node, i, arr) => (
            <div key={node.label} className="flex items-center gap-4">
              <div className="flex flex-col items-center text-center">
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${node.color} mb-2`}>
                  <node.icon className="h-7 w-7" />
                </div>
                <p className="text-xs font-bold text-card-foreground font-body">{node.label}</p>
                <p className="text-[10px] text-muted-foreground font-body">{node.sublabel}</p>
              </div>
              {i < arr.length - 1 && (
                <ArrowRight className="h-5 w-5 text-muted-foreground hidden md:block" />
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
