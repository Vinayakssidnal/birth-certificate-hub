import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Blocks, Search, Hash, Clock, Box, ArrowUpRight, Activity,
  Fuel, CheckCircle2, FileText, UserCheck, ShieldCheck, Copy,
  X, ExternalLink, Layers, ArrowRight, Cpu
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const mockBlocks = [
  { number: 4821093, hash: "0x8a3f...e29d", txCount: 3, timestamp: "12 sec ago", gasUsed: "324,891" },
  { number: 4821092, hash: "0x1b7c...a4f2", txCount: 1, timestamp: "24 sec ago", gasUsed: "121,450" },
  { number: 4821091, hash: "0xd92e...8b13", txCount: 5, timestamp: "36 sec ago", gasUsed: "567,320" },
  { number: 4821090, hash: "0x4f1a...c7e8", txCount: 2, timestamp: "48 sec ago", gasUsed: "245,670" },
  { number: 4821089, hash: "0x7e3d...f192", txCount: 4, timestamp: "60 sec ago", gasUsed: "489,100" },
];

interface Transaction {
  hash: string;
  fullHash: string;
  method: string;
  from: string;
  fromFull: string;
  to: string;
  toFull: string;
  status: string;
  block: number;
  gas: string;
  gasPrice: string;
  nonce: number;
  value: string;
  time: string;
  timestamp: string;
  type: string;
  confirmations: number;
  inputData: string;
  decodedInput: Record<string, string>;
}

const mockTransactions: Transaction[] = [
  {
    hash: "0xa1b2c3d4e5f6...7890abcd",
    fullHash: "0xa1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890",
    method: "createBirthRecord",
    from: "0x742d...35Cc",
    fromFull: "0x742d35Cc8A53B9F6e4c1D7a8E2b3F4C5D6E7F8A9",
    to: "0xContract...Address",
    toFull: "0xBirthCertificateContract1234567890abcdef12",
    status: "Success",
    block: 4821093,
    gas: "121,340",
    gasPrice: "12.5 Gwei",
    nonce: 47,
    value: "0 ETH",
    time: "2 min ago",
    timestamp: "2026-03-08 15:54:08 UTC",
    type: "create",
    confirmations: 12,
    inputData: "0x3a4b5c6d000000000000000000000000000000000000000000000000000000000000...",
    decodedInput: {
      fatherName: "Rajesh Kumar",
      motherName: "Priya Kumar",
      babyName: "Arjun Kumar",
      birthDate: "2026-03-08",
      birthTime: "14:30",
      gender: "Male",
      permanentAddress: "123 Main Street, New Delhi",
      doctorName: "Dr. Sharma",
      hospitalAddress: "City General Hospital, Delhi",
    },
  },
  {
    hash: "0xf9e8d7c6b5a4...3210fedc",
    fullHash: "0xf9e8d7c6b5a43210fedc1234567890abcdef1234567890abcdef1234567890ab",
    method: "approveCertificate",
    from: "0x8Ba1...92Fd",
    fromFull: "0x8Ba192Fd3A4B5C6D7E8F9A0B1C2D3E4F5A6B7C8D",
    to: "0xContract...Address",
    toFull: "0xBirthCertificateContract1234567890abcdef12",
    status: "Success",
    block: 4821092,
    gas: "45,230",
    gasPrice: "11.8 Gwei",
    nonce: 23,
    value: "0 ETH",
    time: "5 min ago",
    timestamp: "2026-03-08 15:51:08 UTC",
    type: "approve",
    confirmations: 24,
    inputData: "0x7d8e9f0a0000000000000000000000000000000000000000000000000000000000000419",
    decodedInput: {
      certificateId: "1045",
    },
  },
  {
    hash: "0x1234abcd5678...efgh9012",
    fullHash: "0x1234abcd5678efgh90121234567890abcdef1234567890abcdef1234567890cd",
    method: "verifyCertificate",
    from: "0x3Ac7...41Ee",
    fromFull: "0x3Ac741Ee5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C",
    to: "0xContract...Address",
    toFull: "0xBirthCertificateContract1234567890abcdef12",
    status: "Success",
    block: 4821091,
    gas: "0 (view)",
    gasPrice: "N/A (view call)",
    nonce: 0,
    value: "0 ETH",
    time: "8 min ago",
    timestamp: "2026-03-08 15:48:08 UTC",
    type: "verify",
    confirmations: 36,
    inputData: "0xab12cd340000000000000000000000000000000000000000000000000000000000000415",
    decodedInput: {
      certificateId: "1042",
    },
  },
  {
    hash: "0xdeadbeef1234...56789abc",
    fullHash: "0xdeadbeef123456789abc1234567890abcdef1234567890abcdef1234567890ef",
    method: "createBirthRecord",
    from: "0x742d...35Cc",
    fromFull: "0x742d35Cc8A53B9F6e4c1D7a8E2b3F4C5D6E7F8A9",
    to: "0xContract...Address",
    toFull: "0xBirthCertificateContract1234567890abcdef12",
    status: "Success",
    block: 4821090,
    gas: "119,800",
    gasPrice: "13.2 Gwei",
    nonce: 46,
    value: "0 ETH",
    time: "12 min ago",
    timestamp: "2026-03-08 15:44:08 UTC",
    type: "create",
    confirmations: 48,
    inputData: "0x3a4b5c6d000000000000000000000000000000000000000000000000000000000000...",
    decodedInput: {
      fatherName: "Amit Singh",
      motherName: "Neha Singh",
      babyName: "Riya Singh",
      birthDate: "2026-03-07",
      birthTime: "09:15",
      gender: "Female",
      permanentAddress: "456 Park Avenue, Mumbai",
      doctorName: "Dr. Patel",
      hospitalAddress: "Apollo Hospital, Mumbai",
    },
  },
  {
    hash: "0xabcdef012345...6789dead",
    fullHash: "0xabcdef0123456789dead1234567890abcdef1234567890abcdef1234567890gh",
    method: "approveCertificate",
    from: "0x8Ba1...92Fd",
    fromFull: "0x8Ba192Fd3A4B5C6D7E8F9A0B1C2D3E4F5A6B7C8D",
    to: "0xContract...Address",
    toFull: "0xBirthCertificateContract1234567890abcdef12",
    status: "Success",
    block: 4821089,
    gas: "44,900",
    gasPrice: "12.0 Gwei",
    nonce: 22,
    value: "0 ETH",
    time: "18 min ago",
    timestamp: "2026-03-08 15:38:08 UTC",
    type: "approve",
    confirmations: 60,
    inputData: "0x7d8e9f0a0000000000000000000000000000000000000000000000000000000000000412",
    decodedInput: {
      certificateId: "1042",
    },
  },
  {
    hash: "0x5678efgh9012...abcd1234",
    fullHash: "0x5678efgh9012abcd12341234567890abcdef1234567890abcdef1234567890ij",
    method: "createBirthRecord",
    from: "0x5dF2...78Ab",
    fromFull: "0x5dF278Ab9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F",
    to: "0xContract...Address",
    toFull: "0xBirthCertificateContract1234567890abcdef12",
    status: "Pending",
    block: 4821089,
    gas: "~120,000",
    gasPrice: "14.0 Gwei",
    nonce: 12,
    value: "0 ETH",
    time: "20 min ago",
    timestamp: "2026-03-08 15:36:08 UTC",
    type: "create",
    confirmations: 0,
    inputData: "0x3a4b5c6d000000000000000000000000000000000000000000000000000000000000...",
    decodedInput: {
      fatherName: "Vikram Reddy",
      motherName: "Lakshmi Reddy",
      babyName: "Aditya Reddy",
      birthDate: "2026-03-08",
      birthTime: "06:45",
      gender: "Male",
      permanentAddress: "789 Lake Road, Hyderabad",
      doctorName: "Dr. Rao",
      hospitalAddress: "KIMS Hospital, Hyderabad",
    },
  },
];

const contractEvents = [
  { event: "BirthRecordCreated", certId: 1047, block: 4821093, time: "2 min ago" },
  { event: "CertificateApproved", certId: 1045, block: 4821092, time: "5 min ago" },
  { event: "BirthRecordCreated", certId: 1046, block: 4821090, time: "12 min ago" },
  { event: "CertificateApproved", certId: 1042, block: 4821089, time: "18 min ago" },
  { event: "BirthRecordCreated", certId: 1044, block: 4821087, time: "25 min ago" },
];

function DetailRow({ label, value, mono = false, copyable = false }: { label: string; value: string; mono?: boolean; copyable?: boolean }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3 border-b border-border last:border-0">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider w-40 shrink-0 font-body">{label}</span>
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span className={`text-sm text-card-foreground break-all ${mono ? "font-mono" : "font-body"}`}>{value}</span>
        {copyable && (
          <button onClick={handleCopy} className="shrink-0 p-1 rounded hover:bg-muted transition-colors" title="Copy">
            {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function BlockchainExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"transactions" | "blocks" | "events">("transactions");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const methodIcon = (type: string) => {
    switch (type) {
      case "create": return <FileText className="h-3.5 w-3.5 text-primary" />;
      case "approve": return <UserCheck className="h-3.5 w-3.5 text-success" />;
      case "verify": return <ShieldCheck className="h-3.5 w-3.5 text-accent" />;
      default: return null;
    }
  };

  const methodColor = (type: string) => {
    switch (type) {
      case "create": return "bg-primary/10 text-primary border-primary/20";
      case "approve": return "bg-success/10 text-success border-success/20";
      case "verify": return "bg-accent/10 text-accent border-accent/20";
      default: return "bg-muted text-muted-foreground";
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
              <p className="text-xs text-muted-foreground font-body mt-1">Click any transaction to view full details</p>
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
                    <tr
                      key={i}
                      onClick={() => setSelectedTx(tx)}
                      className="border-b border-border last:border-0 hover:bg-primary/5 transition-colors cursor-pointer"
                    >
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

      {/* Transaction Detail Dialog */}
      <Dialog open={!!selectedTx} onOpenChange={(open) => !open && setSelectedTx(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card border-border">
          {selectedTx && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg shrink-0 ${
                    selectedTx.type === "create" ? "bg-primary/10" : selectedTx.type === "approve" ? "bg-success/10" : "bg-accent/10"
                  }`}>
                    {selectedTx.type === "create" && <FileText className="h-5 w-5 text-primary" />}
                    {selectedTx.type === "approve" && <UserCheck className="h-5 w-5 text-success" />}
                    {selectedTx.type === "verify" && <ShieldCheck className="h-5 w-5 text-accent" />}
                  </div>
                  <div>
                    <DialogTitle className="text-lg font-bold text-card-foreground">Transaction Details</DialogTitle>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium font-body border rounded-full px-2.5 py-0.5 mt-1 ${methodColor(selectedTx.type)}`}>
                      {methodIcon(selectedTx.type)}
                      {selectedTx.method}
                    </span>
                  </div>
                </div>
              </DialogHeader>

              {/* Status Banner */}
              <div className={`rounded-lg px-4 py-3 flex items-center gap-3 ${
                selectedTx.status === "Success"
                  ? "bg-success/10 border border-success/20"
                  : "bg-warning/10 border border-warning/20"
              }`}>
                {selectedTx.status === "Success"
                  ? <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                  : <Clock className="h-5 w-5 text-warning shrink-0" />}
                <div>
                  <p className={`text-sm font-bold font-body ${selectedTx.status === "Success" ? "text-success" : "text-warning"}`}>
                    {selectedTx.status === "Success" ? "Transaction Successful" : "Transaction Pending"}
                  </p>
                  <p className="text-xs text-muted-foreground font-body">
                    {selectedTx.confirmations > 0 ? `${selectedTx.confirmations} block confirmations` : "Awaiting confirmation"}
                  </p>
                </div>
              </div>

              {/* Overview Section */}
              <div className="space-y-0">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-body mb-2 flex items-center gap-2">
                  <Layers className="h-3.5 w-3.5" /> Overview
                </h4>
                <div className="rounded-lg border border-border bg-muted/30 px-4">
                  <DetailRow label="Transaction Hash" value={selectedTx.fullHash} mono copyable />
                  <DetailRow label="Status" value={selectedTx.status} />
                  <DetailRow label="Block" value={selectedTx.block.toString()} mono />
                  <DetailRow label="Timestamp" value={selectedTx.timestamp} />
                  <DetailRow label="Confirmations" value={selectedTx.confirmations.toString()} mono />
                </div>
              </div>

              {/* Addresses Section */}
              <div className="space-y-0">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-body mb-2 flex items-center gap-2">
                  <ArrowRight className="h-3.5 w-3.5" /> Addresses
                </h4>
                <div className="rounded-lg border border-border bg-muted/30 px-4">
                  <DetailRow label="From" value={selectedTx.fromFull} mono copyable />
                  <DetailRow label="To (Contract)" value={selectedTx.toFull} mono copyable />
                  <DetailRow label="Value" value={selectedTx.value} mono />
                  <DetailRow label="Nonce" value={selectedTx.nonce.toString()} mono />
                </div>
              </div>

              {/* Gas Section */}
              <div className="space-y-0">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-body mb-2 flex items-center gap-2">
                  <Fuel className="h-3.5 w-3.5" /> Gas Details
                </h4>
                <div className="rounded-lg border border-border bg-muted/30 px-4">
                  <DetailRow label="Gas Used" value={selectedTx.gas} mono />
                  <DetailRow label="Gas Price" value={selectedTx.gasPrice} mono />
                </div>
              </div>

              {/* Decoded Input Section */}
              <div className="space-y-0">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-body mb-2 flex items-center gap-2">
                  <Cpu className="h-3.5 w-3.5" /> Decoded Input Data
                </h4>
                <div className="rounded-lg border border-border bg-muted/30 px-4">
                  {Object.entries(selectedTx.decodedInput).map(([key, val]) => (
                    <DetailRow key={key} label={key} value={val} />
                  ))}
                </div>
              </div>

              {/* Raw Input */}
              <div className="space-y-0">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-body mb-2">Raw Input Data</h4>
                <div className="rounded-lg border border-border bg-muted/50 p-3">
                  <p className="text-xs font-mono text-muted-foreground break-all leading-relaxed">{selectedTx.inputData}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
