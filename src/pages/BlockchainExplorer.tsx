import { useState } from "react";
import { motion } from "framer-motion";
import {
  Blocks, Search, Hash, Clock, Box, ArrowUpRight, Activity,
  Fuel, CheckCircle2, FileText, UserCheck, ShieldCheck, Copy
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const mockBlocks = [
  { number: 4821093, hash: "0x8a3f...e29d", txCount: 3, timestamp: "12 sec ago", gasUsed: "324,891" },
  { number: 4821092, hash: "0x1b7c...a4f2", txCount: 1, timestamp: "24 sec ago", gasUsed: "121,450" },
  { number: 4821091, hash: "0xd92e...8b13", txCount: 5, timestamp: "36 sec ago", gasUsed: "567,320" },
  { number: 4821090, hash: "0x4f1a...c7e8", txCount: 2, timestamp: "48 sec ago", gasUsed: "245,670" },
  { number: 4821089, hash: "0x7e3d...f192", txCount: 4, timestamp: "60 sec ago", gasUsed: "489,100" },
];

const mockTransactions = [
  {
    hash: "0xa1b2c3d4e5f6...7890abcd",
    method: "createBirthRecord",
    from: "0x742d...35Cc",
    status: "Success",
    block: 4821093,
    gas: "121,340",
    time: "2 min ago",
    type: "create",
  },
  {
    hash: "0xf9e8d7c6b5a4...3210fedc",
    method: "approveCertificate",
    from: "0x8Ba1...92Fd",
    status: "Success",
    block: 4821092,
    gas: "45,230",
    time: "5 min ago",
    type: "approve",
  },
  {
    hash: "0x1234abcd5678...efgh9012",
    method: "verifyCertificate",
    from: "0x3Ac7...41Ee",
    status: "Success",
    block: 4821091,
    gas: "0 (view)",
    time: "8 min ago",
    type: "verify",
  },
  {
    hash: "0xdeadbeef1234...56789abc",
    method: "createBirthRecord",
    from: "0x742d...35Cc",
    status: "Success",
    block: 4821090,
    gas: "119,800",
    time: "12 min ago",
    type: "create",
  },
  {
    hash: "0xabcdef012345...6789dead",
    method: "approveCertificate",
    from: "0x8Ba1...92Fd",
    status: "Success",
    block: 4821089,
    gas: "44,900",
    time: "18 min ago",
    type: "approve",
  },
  {
    hash: "0x5678efgh9012...abcd1234",
    method: "createBirthRecord",
    from: "0x5dF2...78Ab",
    status: "Pending",
    block: 4821089,
    gas: "~120,000",
    time: "20 min ago",
    type: "create",
  },
];

const contractEvents = [
  { event: "BirthRecordCreated", certId: 1047, block: 4821093, time: "2 min ago" },
  { event: "CertificateApproved", certId: 1045, block: 4821092, time: "5 min ago" },
  { event: "BirthRecordCreated", certId: 1046, block: 4821090, time: "12 min ago" },
  { event: "CertificateApproved", certId: 1042, block: 4821089, time: "18 min ago" },
  { event: "BirthRecordCreated", certId: 1044, block: 4821087, time: "25 min ago" },
];

export default function BlockchainExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"transactions" | "blocks" | "events">("transactions");

  const methodIcon = (type: string) => {
    switch (type) {
      case "create": return <FileText className="h-3.5 w-3.5 text-primary" />;
      case "approve": return <UserCheck className="h-3.5 w-3.5 text-success" />;
      case "verify": return <ShieldCheck className="h-3.5 w-3.5 text-accent" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
            <Blocks className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Blockchain Explorer</h1>
            <p className="text-sm text-muted-foreground font-body">Browse blocks, transactions, and contract events</p>
          </div>
        </div>

        {/* Search */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-card mb-6">
          <div className="flex gap-3">
            <Input
              placeholder="Search by Tx Hash, Block Number, or Certificate ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="font-body font-mono text-sm"
            />
            <Button className="gradient-primary text-primary-foreground font-body gap-2 shrink-0">
              <Search className="h-4 w-4" /> Search
            </Button>
          </div>
        </div>

        {/* Network Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Latest Block", value: "#4,821,093", icon: Box },
            { label: "Avg Gas Price", value: "12.5 Gwei", icon: Fuel },
            { label: "Total Txns", value: "48,291", icon: Activity },
            { label: "Contract Calls", value: "12,847", icon: Hash },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-4 shadow-card flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-body">{stat.label}</p>
                <p className="text-sm font-bold text-card-foreground font-mono">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 rounded-lg bg-muted p-1 w-fit">
          {(["transactions", "blocks", "events"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium font-body capitalize transition-all ${
                activeTab === tab
                  ? "bg-card text-card-foreground shadow-card"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-border bg-card shadow-card overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-bold text-card-foreground font-body">Recent Transactions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    {["Tx Hash", "Method", "From", "Block", "Gas", "Status", "Time"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground font-body uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockTransactions.map((tx, i) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-primary">{tx.hash.slice(0, 18)}...</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium font-body bg-muted rounded-full px-2.5 py-1">
                          {methodIcon(tx.type)}
                          {tx.method}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{tx.from}</td>
                      <td className="px-4 py-3 text-xs font-mono text-card-foreground">{tx.block}</td>
                      <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{tx.gas}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium font-body ${
                          tx.status === "Success" ? "text-success" : "text-warning"
                        }`}>
                          {tx.status === "Success" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground font-body">{tx.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Blocks Tab */}
        {activeTab === "blocks" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-border bg-card shadow-card overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-bold text-card-foreground font-body">Recent Blocks</h3>
            </div>
            <div className="divide-y divide-border">
              {mockBlocks.map((block) => (
                <div key={block.number} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                    <Box className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-card-foreground font-mono">#{block.number}</span>
                      <span className="text-xs text-muted-foreground font-body">{block.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-muted-foreground font-body">
                        Hash: <span className="font-mono text-primary/70">{block.hash}</span>
                      </span>
                      <span className="text-xs text-muted-foreground font-body">{block.txCount} txns</span>
                      <span className="text-xs text-muted-foreground font-body">Gas: {block.gasUsed}</span>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-border bg-card shadow-card overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-bold text-card-foreground font-body">Contract Events</h3>
            </div>
            <div className="divide-y divide-border">
              {contractEvents.map((evt, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg shrink-0 ${
                    evt.event === "BirthRecordCreated" ? "bg-primary/10" : "bg-success/10"
                  }`}>
                    {evt.event === "BirthRecordCreated"
                      ? <FileText className="h-5 w-5 text-primary" />
                      : <CheckCircle2 className="h-5 w-5 text-success" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-card-foreground font-body">{evt.event}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground font-body">
                        Cert ID: <span className="font-mono text-foreground">#{evt.certId}</span>
                      </span>
                      <span className="text-xs text-muted-foreground font-body">
                        Block: <span className="font-mono">{evt.block}</span>
                      </span>
                      <span className="text-xs text-muted-foreground font-body">{evt.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
