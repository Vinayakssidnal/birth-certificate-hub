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

let nextId = 1001;
let nextBlock = 4821100;
let nextActivityId = 1;

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

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<StoredRecord[]>([]);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);

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
