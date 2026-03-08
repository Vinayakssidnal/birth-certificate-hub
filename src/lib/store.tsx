import React, { createContext, useContext, useState, useCallback } from "react";
import type { BirthRecord } from "./blockchain";

export interface StoredRecord {
  id: number;
  record: BirthRecord;
  status: "Pending" | "Approved";
  txHash: string;
  createdAt: string;
  approvedAt?: string;
  approveTxHash?: string;
  creatorAddress: string;
  approverAddress?: string;
  block: number;
}

export interface ActivityEntry {
  id: number;
  type: "create" | "approve" | "verify";
  title: string;
  description: string;
  txHash: string;
  certId: number;
  block: number;
  actor: string;
  actorRole: "Hospital" | "Registrar" | "Public";
  time: string;
  timestamp: number;
}

interface StoreContextType {
  records: StoredRecord[];
  activities: ActivityEntry[];
  addRecord: (record: BirthRecord, txHash: string) => number;
  approveRecord: (id: number, txHash: string) => boolean;
  getRecord: (id: number) => StoredRecord | undefined;
  addVerifyActivity: (certId: number) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

let nextId = 1006;
let nextBlock = 4821106;
let nextActivityId = 11;

function generateAddress(): string {
  const chars = "0123456789abcdef";
  const start = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * 16)]).join("");
  const end = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * 16)]).join("");
  return `0x${start}...${end}`;
}

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff} sec ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

function mockTxHash(seed: number): string {
  const chars = "0123456789abcdef";
  let h = "0x";
  for (let i = 0; i < 64; i++) h += chars[(seed * 7 + i * 13) % 16];
  return h;
}

const now = Date.now();

const seedRecords: StoredRecord[] = [
  {
    id: 1001, status: "Approved", txHash: mockTxHash(1001), createdAt: new Date(now - 86400000 * 3).toISOString(),
    approvedAt: new Date(now - 86400000 * 2).toISOString(), approveTxHash: mockTxHash(2001),
    creatorAddress: "0xa1b2...c3d4", approverAddress: "0xe5f6...7890", block: 4821100,
    record: { babyName: "Aarav Sharma", fatherName: "Rajesh Sharma", motherName: "Priya Sharma", dateOfBirth: "2025-12-10", gender: "Male", hospitalAddress: "City General Hospital", weight: "3.2", birthTime: "08:30" },
  },
  {
    id: 1002, status: "Approved", txHash: mockTxHash(1002), createdAt: new Date(now - 86400000 * 2).toISOString(),
    approvedAt: new Date(now - 86400000 * 1).toISOString(), approveTxHash: mockTxHash(2002),
    creatorAddress: "0x1234...5678", approverAddress: "0x9abc...def0", block: 4821101,
    record: { babyName: "Zara Khan", fatherName: "Imran Khan", motherName: "Sana Khan", dateOfBirth: "2025-12-15", gender: "Female", hospitalAddress: "Apollo Hospital", weight: "2.9", birthTime: "14:15" },
  },
  {
    id: 1003, status: "Approved", txHash: mockTxHash(1003), createdAt: new Date(now - 86400000 * 1.5).toISOString(),
    approvedAt: new Date(now - 86400000 * 0.5).toISOString(), approveTxHash: mockTxHash(2003),
    creatorAddress: "0xabcd...ef01", approverAddress: "0x2345...6789", block: 4821102,
    record: { babyName: "Riya Patel", fatherName: "Amit Patel", motherName: "Neha Patel", dateOfBirth: "2026-01-05", gender: "Female", hospitalAddress: "Max Healthcare", weight: "3.5", birthTime: "22:00" },
  },
  {
    id: 1004, status: "Pending", txHash: mockTxHash(1004), createdAt: new Date(now - 86400000 * 0.8).toISOString(),
    creatorAddress: "0xfed0...1234", block: 4821103,
    record: { babyName: "Arjun Reddy", fatherName: "Vikram Reddy", motherName: "Lakshmi Reddy", dateOfBirth: "2026-02-20", gender: "Male", hospitalAddress: "AIIMS Delhi", weight: "3.1", birthTime: "06:45" },
  },
  {
    id: 1005, status: "Pending", txHash: mockTxHash(1005), createdAt: new Date(now - 3600000 * 5).toISOString(),
    creatorAddress: "0x7890...abcd", block: 4821104,
    record: { babyName: "Meera Nair", fatherName: "Suresh Nair", motherName: "Anjali Nair", dateOfBirth: "2026-03-01", gender: "Female", hospitalAddress: "Fortis Hospital", weight: "2.8", birthTime: "11:20" },
  },
];

const seedActivities: ActivityEntry[] = [
  { id: 1, type: "create", title: "Birth Record Created", description: "Hospital City General Hospital submitted birth record for Baby Aarav Sharma", txHash: mockTxHash(1001), certId: 1001, block: 4821100, actor: "0xa1b2...c3d4", actorRole: "Hospital", time: "3 days ago", timestamp: now - 86400000 * 3 },
  { id: 2, type: "approve", title: "Certificate Approved", description: "Registrar approved birth certificate #1001 for Baby Aarav Sharma", txHash: mockTxHash(2001), certId: 1001, block: 4821100, actor: "0xe5f6...7890", actorRole: "Registrar", time: "2 days ago", timestamp: now - 86400000 * 2 },
  { id: 3, type: "create", title: "Birth Record Created", description: "Hospital Apollo Hospital submitted birth record for Baby Zara Khan", txHash: mockTxHash(1002), certId: 1002, block: 4821101, actor: "0x1234...5678", actorRole: "Hospital", time: "2 days ago", timestamp: now - 86400000 * 2 },
  { id: 4, type: "approve", title: "Certificate Approved", description: "Registrar approved birth certificate #1002 for Baby Zara Khan", txHash: mockTxHash(2002), certId: 1002, block: 4821101, actor: "0x9abc...def0", actorRole: "Registrar", time: "1 day ago", timestamp: now - 86400000 * 1 },
  { id: 5, type: "create", title: "Birth Record Created", description: "Hospital Max Healthcare submitted birth record for Baby Riya Patel", txHash: mockTxHash(1003), certId: 1003, block: 4821102, actor: "0xabcd...ef01", actorRole: "Hospital", time: "1 day ago", timestamp: now - 86400000 * 1.5 },
  { id: 6, type: "approve", title: "Certificate Approved", description: "Registrar approved birth certificate #1003 for Baby Riya Patel", txHash: mockTxHash(2003), certId: 1003, block: 4821102, actor: "0x2345...6789", actorRole: "Registrar", time: "12 hours ago", timestamp: now - 86400000 * 0.5 },
  { id: 7, type: "create", title: "Birth Record Created", description: "Hospital AIIMS Delhi submitted birth record for Baby Arjun Reddy", txHash: mockTxHash(1004), certId: 1004, block: 4821103, actor: "0xfed0...1234", actorRole: "Hospital", time: "19 hours ago", timestamp: now - 86400000 * 0.8 },
  { id: 8, type: "verify", title: "Certificate Verified", description: "Public verification request for certificate #1001 — Status: Approved", txHash: "—", certId: 1001, block: 4821104, actor: "0x5555...aaaa", actorRole: "Public", time: "10 hours ago", timestamp: now - 3600000 * 10 },
  { id: 9, type: "create", title: "Birth Record Created", description: "Hospital Fortis Hospital submitted birth record for Baby Meera Nair", txHash: mockTxHash(1005), certId: 1005, block: 4821104, actor: "0x7890...abcd", actorRole: "Hospital", time: "5 hours ago", timestamp: now - 3600000 * 5 },
  { id: 10, type: "verify", title: "Certificate Verified", description: "Public verification request for certificate #1002 — Status: Approved", txHash: "—", certId: 1002, block: 4821105, actor: "0xbbbb...cccc", actorRole: "Public", time: "2 hours ago", timestamp: now - 3600000 * 2 },
];

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<StoredRecord[]>(seedRecords);
  const [activities, setActivities] = useState<ActivityEntry[]>([...seedActivities].reverse());

  const addRecord = useCallback((record: BirthRecord, txHash: string): number => {
    const id = nextId++;
    const block = nextBlock++;
    const now = Date.now();
    const address = generateAddress();

    const stored: StoredRecord = {
      id,
      record,
      status: "Pending",
      txHash,
      createdAt: new Date().toISOString(),
      creatorAddress: address,
      block,
    };

    const activity: ActivityEntry = {
      id: nextActivityId++,
      type: "create",
      title: "Birth Record Created",
      description: `Hospital ${record.hospitalAddress} submitted birth record for Baby ${record.babyName}`,
      txHash,
      certId: id,
      block,
      actor: address,
      actorRole: "Hospital",
      time: timeAgo(now),
      timestamp: now,
    };

    setRecords((prev) => [stored, ...prev]);
    setActivities((prev) => [activity, ...prev]);
    return id;
  }, []);

  const approveRecord = useCallback((id: number, txHash: string): boolean => {
    let found = false;
    const block = nextBlock++;
    const now = Date.now();
    const address = generateAddress();

    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          found = true;
          return { ...r, status: "Approved" as const, approvedAt: new Date().toISOString(), approveTxHash: txHash, approverAddress: address };
        }
        return r;
      })
    );

    const rec = records.find((r) => r.id === id);
    const babyName = rec?.record.babyName || `ID #${id}`;

    const activity: ActivityEntry = {
      id: nextActivityId++,
      type: "approve",
      title: "Certificate Approved",
      description: `Registrar approved birth certificate #${id} for Baby ${babyName}`,
      txHash,
      certId: id,
      block,
      actor: address,
      actorRole: "Registrar",
      time: timeAgo(now),
      timestamp: now,
    };

    setActivities((prev) => [activity, ...prev]);
    return found || true;
  }, [records]);

  const getRecord = useCallback((id: number): StoredRecord | undefined => {
    return records.find((r) => r.id === id);
  }, [records]);

  const addVerifyActivity = useCallback((certId: number) => {
    const now = Date.now();
    const block = nextBlock++;
    const rec = records.find((r) => r.id === certId);
    const status = rec?.status || "Unknown";

    const activity: ActivityEntry = {
      id: nextActivityId++,
      type: "verify",
      title: "Certificate Verified",
      description: `Public verification request for certificate #${certId} — Status: ${status}`,
      txHash: "—",
      certId,
      block,
      actor: generateAddress(),
      actorRole: "Public",
      time: timeAgo(now),
      timestamp: now,
    };

    setActivities((prev) => [activity, ...prev]);
  }, [records]);

  return (
    <StoreContext.Provider value={{ records, activities, addRecord, approveRecord, getRecord, addVerifyActivity }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
