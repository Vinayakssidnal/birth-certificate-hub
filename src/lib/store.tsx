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

let nextId = 1016;
let nextBlock = 4821120;
let nextActivityId = 31;

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
    id: 1001, status: "Approved", txHash: mockTxHash(1001), createdAt: new Date(now - 86400000 * 30).toISOString(),
    approvedAt: new Date(now - 86400000 * 29).toISOString(), approveTxHash: mockTxHash(2001),
    creatorAddress: "0xa1b2...c3d4", approverAddress: "0xe5f6...7890", block: 4821100,
    record: { babyName: "Aarav Sharma", fatherName: "Rajesh Kumar Sharma", motherName: "Priya Devi Sharma", birthDate: "2025-11-15", gender: "Male", hospitalAddress: "AIIMS New Delhi, Ansari Nagar East, New Delhi – 110029", birthTime: "08:30", permanentAddress: "H.No 45, Sector 12, Dwarka, New Delhi – 110075", doctorName: "Dr. Anand Mehta (Reg. No. DMC/2015/4521)" },
  },
  {
    id: 1002, status: "Approved", txHash: mockTxHash(1002), createdAt: new Date(now - 86400000 * 28).toISOString(),
    approvedAt: new Date(now - 86400000 * 27).toISOString(), approveTxHash: mockTxHash(2002),
    creatorAddress: "0x1234...5678", approverAddress: "0x9abc...def0", block: 4821101,
    record: { babyName: "Zara Fatima Khan", fatherName: "Imran Ahmed Khan", motherName: "Sana Begum Khan", birthDate: "2025-11-20", gender: "Female", hospitalAddress: "Safdarjung Hospital, Ring Road, New Delhi – 110029", birthTime: "14:15", permanentAddress: "Flat 302, Block C, Jamia Nagar, Okhla, New Delhi – 110025", doctorName: "Dr. Farah Siddiqui (Reg. No. DMC/2018/7834)" },
  },
  {
    id: 1003, status: "Approved", txHash: mockTxHash(1003), createdAt: new Date(now - 86400000 * 25).toISOString(),
    approvedAt: new Date(now - 86400000 * 24).toISOString(), approveTxHash: mockTxHash(2003),
    creatorAddress: "0xabcd...ef01", approverAddress: "0x2345...6789", block: 4821102,
    record: { babyName: "Riya Patel", fatherName: "Amit Ramesh Patel", motherName: "Neha Jayesh Patel", birthDate: "2025-12-01", gender: "Female", hospitalAddress: "Civil Hospital Ahmedabad, Asarwa, Ahmedabad – 380016", birthTime: "22:00", permanentAddress: "B-78, Vastrapur Society, S.G. Highway, Ahmedabad – 380015", doctorName: "Dr. Kirti Desai (Reg. No. GMC/2012/3456)" },
  },
  {
    id: 1004, status: "Approved", txHash: mockTxHash(1004), createdAt: new Date(now - 86400000 * 22).toISOString(),
    approvedAt: new Date(now - 86400000 * 21).toISOString(), approveTxHash: mockTxHash(2004),
    creatorAddress: "0xfed0...1234", approverAddress: "0xaaaa...bbbb", block: 4821103,
    record: { babyName: "Arjun Venkatesh Reddy", fatherName: "Vikram Suresh Reddy", motherName: "Lakshmi Devi Reddy", birthDate: "2025-12-10", gender: "Male", hospitalAddress: "Osmania General Hospital, Afzal Gunj, Hyderabad – 500012", birthTime: "06:45", permanentAddress: "Plot 33, Jubilee Hills, Road No. 10, Hyderabad – 500033", doctorName: "Dr. P. Srinivas Rao (Reg. No. TSMC/2010/8901)" },
  },
  {
    id: 1005, status: "Approved", txHash: mockTxHash(1005), createdAt: new Date(now - 86400000 * 18).toISOString(),
    approvedAt: new Date(now - 86400000 * 17).toISOString(), approveTxHash: mockTxHash(2005),
    creatorAddress: "0x7890...abcd", approverAddress: "0xcccc...dddd", block: 4821104,
    record: { babyName: "Meera Suresh Nair", fatherName: "Suresh Gopalan Nair", motherName: "Anjali Mohan Nair", birthDate: "2025-12-18", gender: "Female", hospitalAddress: "Govt. Medical College Hospital, Thiruvananthapuram – 695011", birthTime: "11:20", permanentAddress: "TC 9/1842, Vazhuthacaud, Thiruvananthapuram – 695014", doctorName: "Dr. Deepa Pillai (Reg. No. TCMC/2016/2234)" },
  },
  {
    id: 1006, status: "Approved", txHash: mockTxHash(1006), createdAt: new Date(now - 86400000 * 15).toISOString(),
    approvedAt: new Date(now - 86400000 * 14).toISOString(), approveTxHash: mockTxHash(2006),
    creatorAddress: "0x3456...7890", approverAddress: "0xeeff...1122", block: 4821105,
    record: { babyName: "Kabir Singh Gill", fatherName: "Harpreet Singh Gill", motherName: "Manpreet Kaur Gill", birthDate: "2026-01-02", gender: "Male", hospitalAddress: "PGIMER Chandigarh, Sector 12, Chandigarh – 160012", birthTime: "03:10", permanentAddress: "House No. 234, Phase 7, Mohali, Punjab – 160062", doctorName: "Dr. Gurpreet Kaur (Reg. No. PMC/2014/5567)" },
  },
  {
    id: 1007, status: "Approved", txHash: mockTxHash(1007), createdAt: new Date(now - 86400000 * 12).toISOString(),
    approvedAt: new Date(now - 86400000 * 11).toISOString(), approveTxHash: mockTxHash(2007),
    creatorAddress: "0x5678...9012", approverAddress: "0x3344...5566", block: 4821106,
    record: { babyName: "Ananya Das", fatherName: "Subhash Chandra Das", motherName: "Rina Das", birthDate: "2026-01-10", gender: "Female", hospitalAddress: "SSKM Hospital, 244 AJC Bose Road, Kolkata – 700020", birthTime: "17:45", permanentAddress: "24/1 Gariahat Road, Ballygunge, Kolkata – 700019", doctorName: "Dr. Soumya Banerjee (Reg. No. WBMC/2013/6789)" },
  },
  {
    id: 1008, status: "Approved", txHash: mockTxHash(1008), createdAt: new Date(now - 86400000 * 10).toISOString(),
    approvedAt: new Date(now - 86400000 * 9).toISOString(), approveTxHash: mockTxHash(2008),
    creatorAddress: "0x9012...3456", approverAddress: "0x7788...9900", block: 4821107,
    record: { babyName: "Vivaan Joshi", fatherName: "Rakesh Mohan Joshi", motherName: "Sunita Devi Joshi", birthDate: "2026-01-18", gender: "Male", hospitalAddress: "SMS Hospital, Jaipur, Rajasthan – 302004", birthTime: "09:55", permanentAddress: "C-56, Malviya Nagar, Jaipur – 302017", doctorName: "Dr. Ramesh Agarwal (Reg. No. RMC/2011/4412)" },
  },
  {
    id: 1009, status: "Approved", txHash: mockTxHash(1009), createdAt: new Date(now - 86400000 * 7).toISOString(),
    approvedAt: new Date(now - 86400000 * 6).toISOString(), approveTxHash: mockTxHash(2009),
    creatorAddress: "0xbcde...f012", approverAddress: "0xaabb...ccdd", block: 4821108,
    record: { babyName: "Ishita Rao", fatherName: "Nagaraj Rao", motherName: "Savitri Rao", birthDate: "2026-01-25", gender: "Female", hospitalAddress: "Victoria Hospital, Fort, Bangalore – 560002", birthTime: "13:30", permanentAddress: "No. 89, 4th Cross, Jayanagar, Bangalore – 560011", doctorName: "Dr. Kavitha Murthy (Reg. No. KMC/2015/3321)" },
  },
  {
    id: 1010, status: "Approved", txHash: mockTxHash(1010), createdAt: new Date(now - 86400000 * 5).toISOString(),
    approvedAt: new Date(now - 86400000 * 4).toISOString(), approveTxHash: mockTxHash(2010),
    creatorAddress: "0xdef0...1234", approverAddress: "0xddee...ff00", block: 4821109,
    record: { babyName: "Aditi Verma", fatherName: "Manoj Kumar Verma", motherName: "Kavita Verma", birthDate: "2026-02-03", gender: "Female", hospitalAddress: "King George's Medical University, Lucknow – 226003", birthTime: "20:10", permanentAddress: "112/A, Gomti Nagar, Lucknow – 226010", doctorName: "Dr. Alok Srivastava (Reg. No. UPMC/2009/7890)" },
  },
  {
    id: 1011, status: "Pending", txHash: mockTxHash(1011), createdAt: new Date(now - 86400000 * 3).toISOString(),
    creatorAddress: "0x2468...ace0", block: 4821110,
    record: { babyName: "Rohan Malhotra", fatherName: "Sanjay Malhotra", motherName: "Deepika Malhotra", birthDate: "2026-02-15", gender: "Male", hospitalAddress: "Sir Ganga Ram Hospital, Rajinder Nagar, New Delhi – 110060", birthTime: "07:00", permanentAddress: "D-12, Greater Kailash Part II, New Delhi – 110048", doctorName: "Dr. Vinod Kapoor (Reg. No. DMC/2017/9012)" },
  },
  {
    id: 1012, status: "Pending", txHash: mockTxHash(1012), createdAt: new Date(now - 86400000 * 2).toISOString(),
    creatorAddress: "0x1357...bdf1", block: 4821111,
    record: { babyName: "Saanvi Iyer", fatherName: "Ramakrishnan Iyer", motherName: "Padma Iyer", birthDate: "2026-02-20", gender: "Female", hospitalAddress: "Govt. General Hospital, Chennai – 600003", birthTime: "16:25", permanentAddress: "Old No. 18, New No. 36, T. Nagar, Chennai – 600017", doctorName: "Dr. S. Venkatesh (Reg. No. TNMC/2014/5543)" },
  },
  {
    id: 1013, status: "Pending", txHash: mockTxHash(1013), createdAt: new Date(now - 86400000 * 1).toISOString(),
    creatorAddress: "0x8642...0ace", block: 4821112,
    record: { babyName: "Dev Rajput", fatherName: "Bharat Singh Rajput", motherName: "Geeta Rajput", birthDate: "2026-02-28", gender: "Male", hospitalAddress: "MY Hospital, Indore, Madhya Pradesh – 452001", birthTime: "12:00", permanentAddress: "56, Vijay Nagar, Indore – 452010", doctorName: "Dr. Prashant Dubey (Reg. No. MPMC/2016/6678)" },
  },
  {
    id: 1014, status: "Pending", txHash: mockTxHash(1014), createdAt: new Date(now - 3600000 * 8).toISOString(),
    creatorAddress: "0xface...b00k", block: 4821113,
    record: { babyName: "Anika Bose", fatherName: "Debashish Bose", motherName: "Moumita Bose", birthDate: "2026-03-05", gender: "Female", hospitalAddress: "NRS Medical College, 138 AJC Bose Road, Kolkata – 700014", birthTime: "01:45", permanentAddress: "P-42, Lake Gardens, Kolkata – 700045", doctorName: "Dr. Arijit Sen (Reg. No. WBMC/2018/8890)" },
  },
  {
    id: 1015, status: "Pending", txHash: mockTxHash(1015), createdAt: new Date(now - 3600000 * 2).toISOString(),
    creatorAddress: "0xdead...beef", block: 4821114,
    record: { babyName: "Yash Chauhan", fatherName: "Dinesh Chauhan", motherName: "Meenakshi Chauhan", birthDate: "2026-03-07", gender: "Male", hospitalAddress: "BJ Medical College, Civil Hospital Campus, Ahmedabad – 380016", birthTime: "10:30", permanentAddress: "A-9, Paldi, Ahmedabad – 380007", doctorName: "Dr. Hiren Shah (Reg. No. GMC/2013/4490)" },
  },
];

const seedActivities: ActivityEntry[] = [
  // Creates + Approvals for approved records
  { id: 1, type: "create", title: "Birth Record Created", description: "AIIMS New Delhi submitted birth record for Baby Aarav Sharma", txHash: mockTxHash(1001), certId: 1001, block: 4821100, actor: "0xa1b2...c3d4", actorRole: "Hospital", time: "30 days ago", timestamp: now - 86400000 * 30 },
  { id: 2, type: "approve", title: "Certificate Approved", description: "Sub-Registrar, South Delhi approved birth certificate #1001 for Baby Aarav Sharma", txHash: mockTxHash(2001), certId: 1001, block: 4821100, actor: "0xe5f6...7890", actorRole: "Registrar", time: "29 days ago", timestamp: now - 86400000 * 29 },
  { id: 3, type: "create", title: "Birth Record Created", description: "Safdarjung Hospital submitted birth record for Baby Zara Fatima Khan", txHash: mockTxHash(1002), certId: 1002, block: 4821101, actor: "0x1234...5678", actorRole: "Hospital", time: "28 days ago", timestamp: now - 86400000 * 28 },
  { id: 4, type: "approve", title: "Certificate Approved", description: "Sub-Registrar, South-East Delhi approved birth certificate #1002 for Baby Zara Fatima Khan", txHash: mockTxHash(2002), certId: 1002, block: 4821101, actor: "0x9abc...def0", actorRole: "Registrar", time: "27 days ago", timestamp: now - 86400000 * 27 },
  { id: 5, type: "create", title: "Birth Record Created", description: "Civil Hospital Ahmedabad submitted birth record for Baby Riya Patel", txHash: mockTxHash(1003), certId: 1003, block: 4821102, actor: "0xabcd...ef01", actorRole: "Hospital", time: "25 days ago", timestamp: now - 86400000 * 25 },
  { id: 6, type: "approve", title: "Certificate Approved", description: "Municipal Registrar, Ahmedabad approved birth certificate #1003 for Baby Riya Patel", txHash: mockTxHash(2003), certId: 1003, block: 4821102, actor: "0x2345...6789", actorRole: "Registrar", time: "24 days ago", timestamp: now - 86400000 * 24 },
  { id: 7, type: "create", title: "Birth Record Created", description: "Osmania General Hospital submitted birth record for Baby Arjun Venkatesh Reddy", txHash: mockTxHash(1004), certId: 1004, block: 4821103, actor: "0xfed0...1234", actorRole: "Hospital", time: "22 days ago", timestamp: now - 86400000 * 22 },
  { id: 8, type: "approve", title: "Certificate Approved", description: "Registrar of Births, GHMC Hyderabad approved birth certificate #1004", txHash: mockTxHash(2004), certId: 1004, block: 4821103, actor: "0xaaaa...bbbb", actorRole: "Registrar", time: "21 days ago", timestamp: now - 86400000 * 21 },
  { id: 9, type: "create", title: "Birth Record Created", description: "Govt. Medical College Hospital, Thiruvananthapuram submitted birth record for Baby Meera Suresh Nair", txHash: mockTxHash(1005), certId: 1005, block: 4821104, actor: "0x7890...abcd", actorRole: "Hospital", time: "18 days ago", timestamp: now - 86400000 * 18 },
  { id: 10, type: "approve", title: "Certificate Approved", description: "Registrar, Thiruvananthapuram Corporation approved birth certificate #1005", txHash: mockTxHash(2005), certId: 1005, block: 4821104, actor: "0xcccc...dddd", actorRole: "Registrar", time: "17 days ago", timestamp: now - 86400000 * 17 },
  { id: 11, type: "create", title: "Birth Record Created", description: "PGIMER Chandigarh submitted birth record for Baby Kabir Singh Gill", txHash: mockTxHash(1006), certId: 1006, block: 4821105, actor: "0x3456...7890", actorRole: "Hospital", time: "15 days ago", timestamp: now - 86400000 * 15 },
  { id: 12, type: "approve", title: "Certificate Approved", description: "Registrar, Chandigarh Municipal Corporation approved birth certificate #1006", txHash: mockTxHash(2006), certId: 1006, block: 4821105, actor: "0xeeff...1122", actorRole: "Registrar", time: "14 days ago", timestamp: now - 86400000 * 14 },
  { id: 13, type: "create", title: "Birth Record Created", description: "SSKM Hospital, Kolkata submitted birth record for Baby Ananya Das", txHash: mockTxHash(1007), certId: 1007, block: 4821106, actor: "0x5678...9012", actorRole: "Hospital", time: "12 days ago", timestamp: now - 86400000 * 12 },
  { id: 14, type: "approve", title: "Certificate Approved", description: "Registrar, Kolkata Municipal Corporation approved birth certificate #1007", txHash: mockTxHash(2007), certId: 1007, block: 4821106, actor: "0x3344...5566", actorRole: "Registrar", time: "11 days ago", timestamp: now - 86400000 * 11 },
  { id: 15, type: "create", title: "Birth Record Created", description: "SMS Hospital, Jaipur submitted birth record for Baby Vivaan Joshi", txHash: mockTxHash(1008), certId: 1008, block: 4821107, actor: "0x9012...3456", actorRole: "Hospital", time: "10 days ago", timestamp: now - 86400000 * 10 },
  { id: 16, type: "approve", title: "Certificate Approved", description: "Registrar, Jaipur Nagar Nigam approved birth certificate #1008", txHash: mockTxHash(2008), certId: 1008, block: 4821107, actor: "0x7788...9900", actorRole: "Registrar", time: "9 days ago", timestamp: now - 86400000 * 9 },
  { id: 17, type: "create", title: "Birth Record Created", description: "Victoria Hospital, Bangalore submitted birth record for Baby Ishita Rao", txHash: mockTxHash(1009), certId: 1009, block: 4821108, actor: "0xbcde...f012", actorRole: "Hospital", time: "7 days ago", timestamp: now - 86400000 * 7 },
  { id: 18, type: "approve", title: "Certificate Approved", description: "Registrar, BBMP Bangalore approved birth certificate #1009", txHash: mockTxHash(2009), certId: 1009, block: 4821108, actor: "0xaabb...ccdd", actorRole: "Registrar", time: "6 days ago", timestamp: now - 86400000 * 6 },
  { id: 19, type: "create", title: "Birth Record Created", description: "KGMU, Lucknow submitted birth record for Baby Aditi Verma", txHash: mockTxHash(1010), certId: 1010, block: 4821109, actor: "0xdef0...1234", actorRole: "Hospital", time: "5 days ago", timestamp: now - 86400000 * 5 },
  { id: 20, type: "approve", title: "Certificate Approved", description: "Registrar, Lucknow Nagar Nigam approved birth certificate #1010", txHash: mockTxHash(2010), certId: 1010, block: 4821109, actor: "0xddee...ff00", actorRole: "Registrar", time: "4 days ago", timestamp: now - 86400000 * 4 },
  // Pending creates
  { id: 21, type: "create", title: "Birth Record Created", description: "Sir Ganga Ram Hospital submitted birth record for Baby Rohan Malhotra", txHash: mockTxHash(1011), certId: 1011, block: 4821110, actor: "0x2468...ace0", actorRole: "Hospital", time: "3 days ago", timestamp: now - 86400000 * 3 },
  { id: 22, type: "create", title: "Birth Record Created", description: "Govt. General Hospital, Chennai submitted birth record for Baby Saanvi Iyer", txHash: mockTxHash(1012), certId: 1012, block: 4821111, actor: "0x1357...bdf1", actorRole: "Hospital", time: "2 days ago", timestamp: now - 86400000 * 2 },
  { id: 23, type: "create", title: "Birth Record Created", description: "MY Hospital, Indore submitted birth record for Baby Dev Rajput", txHash: mockTxHash(1013), certId: 1013, block: 4821112, actor: "0x8642...0ace", actorRole: "Hospital", time: "1 day ago", timestamp: now - 86400000 * 1 },
  { id: 24, type: "create", title: "Birth Record Created", description: "NRS Medical College, Kolkata submitted birth record for Baby Anika Bose", txHash: mockTxHash(1014), certId: 1014, block: 4821113, actor: "0xface...b00k", actorRole: "Hospital", time: "8 hours ago", timestamp: now - 3600000 * 8 },
  { id: 25, type: "create", title: "Birth Record Created", description: "BJ Medical College, Ahmedabad submitted birth record for Baby Yash Chauhan", txHash: mockTxHash(1015), certId: 1015, block: 4821114, actor: "0xdead...beef", actorRole: "Hospital", time: "2 hours ago", timestamp: now - 3600000 * 2 },
  // Public verifications
  { id: 26, type: "verify", title: "Certificate Verified", description: "Public verification request for certificate #1001 — Status: Approved", txHash: "—", certId: 1001, block: 4821115, actor: "0x5555...aaaa", actorRole: "Public", time: "20 days ago", timestamp: now - 86400000 * 20 },
  { id: 27, type: "verify", title: "Certificate Verified", description: "Public verification request for certificate #1003 — Status: Approved", txHash: "—", certId: 1003, block: 4821116, actor: "0x6666...bbbb", actorRole: "Public", time: "15 days ago", timestamp: now - 86400000 * 15 },
  { id: 28, type: "verify", title: "Certificate Verified", description: "Public verification request for certificate #1002 — Status: Approved", txHash: "—", certId: 1002, block: 4821117, actor: "0xbbbb...cccc", actorRole: "Public", time: "8 days ago", timestamp: now - 86400000 * 8 },
  { id: 29, type: "verify", title: "Certificate Verified", description: "Public verification request for certificate #1005 — Status: Approved", txHash: "—", certId: 1005, block: 4821118, actor: "0x7777...dddd", actorRole: "Public", time: "4 days ago", timestamp: now - 86400000 * 4 },
  { id: 30, type: "verify", title: "Certificate Verified", description: "Public verification request for certificate #1008 — Status: Approved", txHash: "—", certId: 1008, block: 4821119, actor: "0x8888...eeee", actorRole: "Public", time: "1 day ago", timestamp: now - 86400000 * 1 },
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
