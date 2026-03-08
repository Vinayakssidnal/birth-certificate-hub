import { useState } from "react";
import { motion } from "framer-motion";
import {
  Blocks, Search, Hash, Clock, Box, Activity,
  Fuel, CheckCircle2, FileText, UserCheck, ShieldCheck, Copy,
  Layers, ArrowRight, Cpu, AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useStore } from "@/lib/store";

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
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
  const { records, activities } = useStore();

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

  const methodName = (type: string) => {
    switch (type) {
      case "create": return "createBirthRecord";
      case "approve": return "approveCertificate";
      case "verify": return "verifyCertificate";
      default: return type;
    }
  };

  // Get the record associated with selected activity
  const selectedRecord = selectedActivity ? records.find((r) => r.id === selectedActivity.certId) : null;

  // Filter activities based on search
  const filteredActivities = searchQuery.trim()
    ? activities.filter((a) =>
        a.txHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.certId.toString().includes(searchQuery) ||
        a.block.toString().includes(searchQuery)
      )
    : activities;

  // Derive blocks from activities with hashes
  function generateBlockHash(blockNum: number, seed: number): string {
    const chars = "0123456789abcdef";
    let hash = "0x";
    for (let i = 0; i < 64; i++) {
      hash += chars[(blockNum * 7 + seed * 13 + i * 31) % 16];
    }
    return hash;
  }

  const blockMap = new Map<number, { number: number; txCount: number; timestamp: string; gasUsed: string; currentHash: string; previousHash: string }>();
  activities.forEach((a) => {
    const existing = blockMap.get(a.block);
    if (existing) {
      existing.txCount += 1;
    } else {
      blockMap.set(a.block, {
        number: a.block,
        txCount: 1,
        timestamp: a.time,
        gasUsed: a.type === "verify" ? "0" : `${Math.floor(Math.random() * 200000 + 50000).toLocaleString()}`,
        currentHash: generateBlockHash(a.block, 1),
        previousHash: generateBlockHash(a.block - 1, 1),
      });
    }
  });
  const blocks = Array.from(blockMap.values()).sort((a, b) => b.number - a.number);

  // Derive events from activities
  const events = activities
    .filter((a) => a.type !== "verify")
    .map((a) => ({
      event: a.type === "create" ? "BirthRecordCreated" : "CertificateApproved",
      certId: a.certId,
      block: a.block,
      time: a.time,
      type: a.type,
    }));

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
            { label: "Latest Block", value: blocks.length > 0 ? `#${blocks[0].number}` : "—", icon: Box },
            { label: "Total Txns", value: activities.length.toString(), icon: Activity },
            { label: "Records Created", value: activities.filter((a) => a.type === "create").length.toString(), icon: FileText },
            { label: "Approved", value: activities.filter((a) => a.type === "approve").length.toString(), icon: CheckCircle2 },
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
            {filteredActivities.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground font-body">No transactions yet. Create a birth record to see transactions here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      {["Tx Hash", "Method", "From", "Block", "Cert ID", "Status", "Time"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground font-body uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredActivities.map((a) => (
                      <tr
                        key={a.id}
                        onClick={() => setSelectedActivity(a)}
                        className="border-b border-border last:border-0 hover:bg-primary/5 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3 text-xs font-mono text-primary">
                          {a.txHash === "—" ? "— (view call)" : `${a.txHash.slice(0, 18)}...`}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium font-body bg-muted rounded-full px-2.5 py-1">
                            {methodIcon(a.type)}
                            {methodName(a.type)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{a.actor}</td>
                        <td className="px-4 py-3 text-xs font-mono text-card-foreground">{a.block}</td>
                        <td className="px-4 py-3 text-xs font-mono text-card-foreground">#{a.certId}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 text-xs font-medium font-body text-success">
                            <CheckCircle2 className="h-3 w-3" /> Success
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground font-body">{a.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
            {blocks.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground font-body">No blocks yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {blocks.map((block) => (
                  <div key={block.number} className="px-6 py-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                        <Box className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-card-foreground font-mono">#{block.number}</span>
                          <span className="text-xs text-muted-foreground font-body">{block.timestamp}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-muted-foreground font-body">{block.txCount} txn{block.txCount > 1 ? "s" : ""}</span>
                          <span className="text-xs text-muted-foreground font-body">Gas: {block.gasUsed}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 ml-14 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Hash className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="text-xs text-muted-foreground font-body w-24 shrink-0">Current Hash:</span>
                        <span className="text-xs font-mono text-primary break-all">{block.currentHash}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Hash className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="text-xs text-muted-foreground font-body w-24 shrink-0">Previous Hash:</span>
                        <span className="text-xs font-mono text-muted-foreground break-all">{block.previousHash}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            {events.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground font-body">No events yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {events.map((evt, i) => (
                  <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg shrink-0 ${
                      evt.type === "create" ? "bg-primary/10" : "bg-success/10"
                    }`}>
                      {evt.type === "create"
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
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Transaction Detail Dialog */}
      <Dialog open={!!selectedActivity} onOpenChange={(open) => !open && setSelectedActivity(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card border-border">
          {selectedActivity && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg shrink-0 ${
                    selectedActivity.type === "create" ? "bg-primary/10" : selectedActivity.type === "approve" ? "bg-success/10" : "bg-accent/10"
                  }`}>
                    {selectedActivity.type === "create" && <FileText className="h-5 w-5 text-primary" />}
                    {selectedActivity.type === "approve" && <UserCheck className="h-5 w-5 text-success" />}
                    {selectedActivity.type === "verify" && <ShieldCheck className="h-5 w-5 text-accent" />}
                  </div>
                  <div>
                    <DialogTitle className="text-lg font-bold text-card-foreground">Transaction Details</DialogTitle>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium font-body border rounded-full px-2.5 py-0.5 mt-1 ${methodColor(selectedActivity.type)}`}>
                      {methodIcon(selectedActivity.type)}
                      {methodName(selectedActivity.type)}
                    </span>
                  </div>
                </div>
              </DialogHeader>

              {/* Status Banner */}
              <div className="rounded-lg px-4 py-3 flex items-center gap-3 bg-success/10 border border-success/20">
                <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                <div>
                  <p className="text-sm font-bold font-body text-success">Transaction Successful</p>
                  <p className="text-xs text-muted-foreground font-body">Block #{selectedActivity.block}</p>
                </div>
              </div>

              {/* Overview */}
              <div className="space-y-0">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-body mb-2 flex items-center gap-2">
                  <Layers className="h-3.5 w-3.5" /> Overview
                </h4>
                <div className="rounded-lg border border-border bg-muted/30 px-4">
                  <DetailRow label="Transaction Hash" value={selectedActivity.txHash} mono copyable />
                  <DetailRow label="Block" value={selectedActivity.block.toString()} mono />
                  <DetailRow label="Certificate ID" value={`#${selectedActivity.certId}`} mono />
                  <DetailRow label="Time" value={selectedActivity.time} />
                </div>
              </div>

              {/* Addresses */}
              <div className="space-y-0">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-body mb-2 flex items-center gap-2">
                  <ArrowRight className="h-3.5 w-3.5" /> Actor
                </h4>
                <div className="rounded-lg border border-border bg-muted/30 px-4">
                  <DetailRow label="Role" value={selectedActivity.actorRole} />
                  <DetailRow label="Address" value={selectedActivity.actor} mono copyable />
                </div>
              </div>

              {/* Decoded Input — show record data if available */}
              {selectedRecord && (
                <div className="space-y-0">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-body mb-2 flex items-center gap-2">
                    <Cpu className="h-3.5 w-3.5" /> {selectedActivity.type === "create" ? "Birth Record Data" : "Certificate Data"}
                  </h4>
                  <div className="rounded-lg border border-border bg-muted/30 px-4">
                    <DetailRow label="Baby Name" value={selectedRecord.record.babyName} />
                    <DetailRow label="Father Name" value={selectedRecord.record.fatherName} />
                    <DetailRow label="Mother Name" value={selectedRecord.record.motherName} />
                    <DetailRow label="Birth Date" value={selectedRecord.record.birthDate} />
                    <DetailRow label="Birth Time" value={selectedRecord.record.birthTime} />
                    <DetailRow label="Gender" value={selectedRecord.record.gender} />
                    <DetailRow label="Hospital" value={selectedRecord.record.hospitalAddress} />
                    <DetailRow label="Doctor" value={selectedRecord.record.doctorName} />
                    <DetailRow label="Address" value={selectedRecord.record.permanentAddress} />
                    <DetailRow label="Status" value={selectedRecord.status} />
                  </div>
                </div>
              )}

              {!selectedRecord && selectedActivity.type !== "verify" && (
                <div className="space-y-0">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-body mb-2 flex items-center gap-2">
                    <Cpu className="h-3.5 w-3.5" /> Input Data
                  </h4>
                  <div className="rounded-lg border border-border bg-muted/30 px-4">
                    <DetailRow label="Certificate ID" value={`#${selectedActivity.certId}`} mono />
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
