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

// ─── Helpers ───
function generateAddress(): string {
  const chars = "0123456789abcdef";
  const s = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * 16)]).join("");
  const e = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * 16)]).join("");
  return `0x${s}...${e}`;
}

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff} sec ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

function seedTxHash(seed: number): string {
  const c = "0123456789abcdef";
  let h = "0x";
  for (let i = 0; i < 64; i++) h += c[(seed * 7 + i * 13 + 3) % 16];
  return h;
}

function seedAddr(seed: number): string {
  const c = "0123456789abcdef";
  const s = Array.from({ length: 4 }, (_, i) => c[(seed * 3 + i * 7) % 16]).join("");
  const e = Array.from({ length: 4 }, (_, i) => c[(seed * 11 + i * 5) % 16]).join("");
  return `0x${s}...${e}`;
}

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

// ─── Data Pools ───
const maleFirst = ["Aarav","Vivaan","Aditya","Vihaan","Arjun","Sai","Reyansh","Ayaan","Krishna","Ishaan","Shaurya","Atharva","Advait","Rudra","Kabir","Dhruv","Ritvik","Aarush","Kian","Darsh","Arnav","Pranav","Rohan","Dev","Yash","Harsh","Laksh","Manav","Nikhil","Omkar","Parth","Rishi","Sahil","Tanish","Ved","Aakash","Bharat","Chirag","Deepak","Gaurav","Hemant","Jayesh","Kartik","Mihir","Nakul","Pranit","Rahul","Siddharth","Tushar","Varun"];
const femaleFirst = ["Saanvi","Aanya","Aadhya","Aaradhya","Ananya","Pari","Anika","Navya","Angel","Diya","Myra","Sara","Iraa","Ahana","Kiara","Riya","Kavya","Meera","Ishita","Aditi","Nisha","Pooja","Shreya","Tanya","Isha","Jhanvi","Kriti","Mahi","Neha","Pallavi","Rhea","Simran","Tanvi","Urvi","Vidhi","Aisha","Bhavya","Charvi","Devika","Eesha","Fatima","Gauri","Hina","Ira","Janvi","Khushi","Lavanya","Mira","Nandini","Prisha"];
const lastNames = ["Sharma","Patel","Kumar","Singh","Reddy","Nair","Joshi","Gupta","Verma","Das","Iyer","Bose","Chauhan","Malhotra","Rao","Gill","Khan","Pillai","Desai","Mehta","Agarwal","Banerjee","Dubey","Kapoor","Sen","Shah","Srivastava","Murthy","Mishra","Pandey","Chopra","Thakur","Saxena","Tiwari","Yadav","Bhatt","Hegde","Menon","Kulkarni","Patil","Chandra","Dutta","Ghosh","Mitra","Sarkar","Bhattacharya","Mukherjee","Roy","Sinha","Prasad"];
const midMale = ["Kumar","Mohan","Ramesh","Suresh","Prakash","Chandra","Shankar","Rajan","Kishore","Gopal"];
const midFemale = ["Devi","Kumari","Lakshmi","Priya","Rani","Kaur","Begum","Jyoti","Padma","Sita"];

const hospitals: { name: string; city: string; pin: string; state: string; registrar: string }[] = [
  { name: "AIIMS", city: "New Delhi", pin: "110029", state: "Delhi", registrar: "Sub-Registrar, South Delhi" },
  { name: "Safdarjung Hospital", city: "New Delhi", pin: "110029", state: "Delhi", registrar: "Sub-Registrar, South-East Delhi" },
  { name: "Sir Ganga Ram Hospital", city: "New Delhi", pin: "110060", state: "Delhi", registrar: "Registrar, North Delhi MCD" },
  { name: "Ram Manohar Lohia Hospital", city: "New Delhi", pin: "110001", state: "Delhi", registrar: "Registrar, Central Delhi" },
  { name: "Lady Hardinge Medical College", city: "New Delhi", pin: "110001", state: "Delhi", registrar: "Registrar, NDMC" },
  { name: "Civil Hospital", city: "Ahmedabad", pin: "380016", state: "Gujarat", registrar: "Municipal Registrar, Ahmedabad" },
  { name: "BJ Medical College", city: "Ahmedabad", pin: "380016", state: "Gujarat", registrar: "Registrar, AMC" },
  { name: "Osmania General Hospital", city: "Hyderabad", pin: "500012", state: "Telangana", registrar: "Registrar, GHMC Hyderabad" },
  { name: "Gandhi Hospital", city: "Hyderabad", pin: "500003", state: "Telangana", registrar: "Registrar, Secunderabad MC" },
  { name: "Nizam's Institute (NIMS)", city: "Hyderabad", pin: "500082", state: "Telangana", registrar: "Registrar, Rangareddy" },
  { name: "PGIMER", city: "Chandigarh", pin: "160012", state: "Chandigarh", registrar: "Registrar, Chandigarh MC" },
  { name: "GMCH Sector 32", city: "Chandigarh", pin: "160030", state: "Chandigarh", registrar: "Registrar, Chandigarh UT" },
  { name: "Govt. Medical College Hospital", city: "Thiruvananthapuram", pin: "695011", state: "Kerala", registrar: "Registrar, TVM Corporation" },
  { name: "Medical College Kozhikode", city: "Kozhikode", pin: "673008", state: "Kerala", registrar: "Registrar, Kozhikode Corporation" },
  { name: "SSKM Hospital", city: "Kolkata", pin: "700020", state: "West Bengal", registrar: "Registrar, KMC Kolkata" },
  { name: "NRS Medical College", city: "Kolkata", pin: "700014", state: "West Bengal", registrar: "Registrar, KMC South" },
  { name: "RG Kar Medical College", city: "Kolkata", pin: "700004", state: "West Bengal", registrar: "Registrar, KMC North" },
  { name: "SMS Hospital", city: "Jaipur", pin: "302004", state: "Rajasthan", registrar: "Registrar, Jaipur Nagar Nigam" },
  { name: "JLN Medical College", city: "Ajmer", pin: "305001", state: "Rajasthan", registrar: "Registrar, Ajmer MC" },
  { name: "Victoria Hospital", city: "Bangalore", pin: "560002", state: "Karnataka", registrar: "Registrar, BBMP Bangalore" },
  { name: "Bowring Hospital", city: "Bangalore", pin: "560001", state: "Karnataka", registrar: "Registrar, BBMP East" },
  { name: "KGMU", city: "Lucknow", pin: "226003", state: "Uttar Pradesh", registrar: "Registrar, Lucknow Nagar Nigam" },
  { name: "BHU Hospital", city: "Varanasi", pin: "221005", state: "Uttar Pradesh", registrar: "Registrar, Varanasi MC" },
  { name: "MY Hospital", city: "Indore", pin: "452001", state: "Madhya Pradesh", registrar: "Registrar, Indore MC" },
  { name: "Hamidia Hospital", city: "Bhopal", pin: "462001", state: "Madhya Pradesh", registrar: "Registrar, Bhopal MC" },
  { name: "Govt. General Hospital", city: "Chennai", pin: "600003", state: "Tamil Nadu", registrar: "Registrar, Chennai Corporation" },
  { name: "Rajiv Gandhi GH", city: "Chennai", pin: "600003", state: "Tamil Nadu", registrar: "Registrar, Chennai South" },
  { name: "Govt. Stanley Hospital", city: "Chennai", pin: "600001", state: "Tamil Nadu", registrar: "Registrar, Chennai North" },
  { name: "Sassoon Hospital", city: "Pune", pin: "411001", state: "Maharashtra", registrar: "Registrar, PMC Pune" },
  { name: "KEM Hospital", city: "Mumbai", pin: "400012", state: "Maharashtra", registrar: "Registrar, BMC Mumbai" },
  { name: "Sion Hospital", city: "Mumbai", pin: "400022", state: "Maharashtra", registrar: "Registrar, BMC East" },
  { name: "JJ Hospital", city: "Mumbai", pin: "400008", state: "Maharashtra", registrar: "Registrar, BMC South" },
  { name: "IGMC", city: "Shimla", pin: "171001", state: "Himachal Pradesh", registrar: "Registrar, Shimla MC" },
  { name: "SCB Medical College", city: "Cuttack", pin: "753007", state: "Odisha", registrar: "Registrar, CMC Cuttack" },
  { name: "PMCH", city: "Patna", pin: "800004", state: "Bihar", registrar: "Registrar, Patna MC" },
  { name: "RIMS", city: "Ranchi", pin: "834009", state: "Jharkhand", registrar: "Registrar, Ranchi MC" },
  { name: "GMC Srinagar", city: "Srinagar", pin: "190010", state: "J&K", registrar: "Registrar, SMC Srinagar" },
  { name: "GMCH", city: "Guwahati", pin: "781032", state: "Assam", registrar: "Registrar, GMC Guwahati" },
  { name: "JNIMS", city: "Imphal", pin: "795005", state: "Manipur", registrar: "Registrar, Imphal MC" },
  { name: "NEIGRIHMS", city: "Shillong", pin: "793018", state: "Meghalaya", registrar: "Registrar, Shillong MC" },
];

const streetAddrs = [
  "H.No 45, Sector 12, Dwarka","Flat 302, Block C, Vasant Kunj","A-12, Greater Kailash Part II",
  "D-56, Lajpat Nagar","78, Rajouri Garden","112/A, Gomti Nagar","24/1, Gariahat Road",
  "P-42, Lake Gardens","No. 89, 4th Cross, Jayanagar","Plot 33, Jubilee Hills",
  "B-78, Vastrapur Society","TC 9/1842, Vazhuthacaud","House 234, Phase 7, Mohali",
  "C-56, Malviya Nagar","Old No. 18, T. Nagar","56, Vijay Nagar",
  "9, Marine Drive","Plot 12, Banjara Hills","Flat 501, Koramangala",
  "23, Salt Lake City, Sector V","15/2, Alipore Road","E-101, Aundh Road",
  "G-45, Model Town","7, Civil Lines","K-23, Shivaji Nagar",
  "A-7, Paldi","Flat 201, Boat Club Road","H-33, Defence Colony",
  "10, MG Road","B-22, Baner Road","45, Anna Nagar East",
  "88, Besant Nagar","L-12, Indiranagar","3/1, Park Street",
  "F-67, Saket","N-11, Punjabi Bagh","102, Whitefield Main Road",
  "P-9, Tollygunge","R-34, Alwarpet","22, Camp Area",
  "Q-5, Bandra West","17, Koregaon Park","J-8, Sarojini Nagar",
  "W-14, Adyar","S-3, Hazratganj","U-21, MG Marg",
  "X-6, BTM Layout","V-19, Andheri East","T-11, Kolathur",
  "M-2, Ballygunge Place","Z-9, Mylapore",
];

const doctorFirst = ["Anand","Farah","Kirti","Srinivas","Deepa","Gurpreet","Soumya","Ramesh","Kavitha","Alok","Vinod","Arijit","Hiren","Prashant","Venkatesh","Rajan","Meena","Sunil","Pooja","Rahul","Neha","Amit","Sanjay","Priya","Manoj","Anu","Vivek","Shweta","Arjun","Divya"];
const regPrefixes = ["DMC","GMC","TSMC","TCMC","PMC","WBMC","RMC","KMC","UPMC","MPMC","TNMC","MSMC","HPMC","CUMC","OMC","BMC","JKMC","AMC"];

const NOW = Date.now();
const DAY = 86400000;
const SEED_COUNT = 150;

function generateSeedData() {
  const records: StoredRecord[] = [];
  const activities: ActivityEntry[] = [];
  let actId = 1;
  let blockNum = 4821100;

  for (let i = 0; i < SEED_COUNT; i++) {
    const id = 1001 + i;
    const isFemale = i % 3 === 1 || i % 5 === 0;
    const gender = isFemale ? "Female" : "Male";
    const firstName = isFemale ? pick(femaleFirst, i * 7 + 3) : pick(maleFirst, i * 7 + 3);
    const lastName = pick(lastNames, i * 11 + 5);
    const fatherFirst = pick(maleFirst, i * 13 + 7);
    const fatherMid = pick(midMale, i * 17 + 2);
    const motherFirst = pick(femaleFirst, i * 19 + 1);
    const motherMid = pick(midFemale, i * 23 + 4);
    const hosp = pick(hospitals, i * 3 + 1);
    const addr = pick(streetAddrs, i * 7 + 2);
    const docFirst = pick(doctorFirst, i * 11 + 3);
    const regPre = pick(regPrefixes, i * 5 + 1);
    const regYear = 2008 + (i % 16);
    const regNum = 1000 + ((i * 137) % 9000);

    const daysAgo = SEED_COUNT - i + 5;
    const createdTs = NOW - daysAgo * DAY;
    const block = blockNum++;

    const babyName = `${firstName} ${lastName}`;
    const birthMonth = ((i % 12) + 1).toString().padStart(2, "0");
    const birthDay = ((i % 28) + 1).toString().padStart(2, "0");
    const birthYear = i < 80 ? "2025" : "2026";
    const birthHour = ((i * 3) % 24).toString().padStart(2, "0");
    const birthMin = ((i * 7) % 60).toString().padStart(2, "0");

    const creatorAddr = seedAddr(id);
    const isApproved = i < Math.floor(SEED_COUNT * 0.7);

    const rec: StoredRecord = {
      id,
      status: isApproved ? "Approved" : "Pending",
      txHash: seedTxHash(id),
      createdAt: new Date(createdTs).toISOString(),
      creatorAddress: creatorAddr,
      block,
      record: {
        babyName,
        fatherName: `${fatherFirst} ${fatherMid} ${lastName}`,
        motherName: `${motherFirst} ${motherMid} ${lastName}`,
        birthDate: `${birthYear}-${birthMonth}-${birthDay}`,
        birthTime: `${birthHour}:${birthMin}`,
        gender,
        hospitalAddress: `${hosp.name}, ${hosp.city}, ${hosp.state} – ${hosp.pin}`,
        permanentAddress: `${addr}, ${hosp.city} – ${hosp.pin}`,
        doctorName: `Dr. ${docFirst} (Reg. No. ${regPre}/${regYear}/${regNum})`,
      },
    };

    if (isApproved) {
      const approveTs = createdTs + DAY;
      rec.approvedAt = new Date(approveTs).toISOString();
      rec.approveTxHash = seedTxHash(id + 5000);
      rec.approverAddress = seedAddr(id + 5000);
    }

    records.push(rec);

    activities.push({
      id: actId++,
      type: "create",
      title: "Birth Record Created",
      description: `${hosp.name}, ${hosp.city} submitted birth record for Baby ${babyName}`,
      txHash: seedTxHash(id),
      certId: id,
      block,
      actor: creatorAddr,
      actorRole: "Hospital",
      time: timeAgo(createdTs),
      timestamp: createdTs,
    });

    if (isApproved) {
      const approveTs = createdTs + DAY;
      const aBlock = blockNum++;
      activities.push({
        id: actId++,
        type: "approve",
        title: "Certificate Approved",
        description: `${hosp.registrar} approved birth certificate #${id} for Baby ${babyName}`,
        txHash: seedTxHash(id + 5000),
        certId: id,
        block: aBlock,
        actor: seedAddr(id + 5000),
        actorRole: "Registrar",
        time: timeAgo(approveTs),
        timestamp: approveTs,
      });
    }

    if (isApproved && i % 5 === 0) {
      const verifyTs = createdTs + DAY * 3;
      const vBlock = blockNum++;
      activities.push({
        id: actId++,
        type: "verify",
        title: "Certificate Verified",
        description: `Public verification request for certificate #${id} — Status: Approved`,
        txHash: "—",
        certId: id,
        block: vBlock,
        actor: seedAddr(id + 9000),
        actorRole: "Public",
        time: timeAgo(verifyTs),
        timestamp: verifyTs,
      });
    }
  }

  return { records, activities: activities.sort((a, b) => a.timestamp - b.timestamp), nextBlock: blockNum, nextActId: actId };
}

const seed = generateSeedData();
let nextId = 1001 + SEED_COUNT;
let nextBlock = seed.nextBlock + 10;
let nextActivityId = seed.nextActId + 10;

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<StoredRecord[]>(seed.records);
  const [activities, setActivities] = useState<ActivityEntry[]>([...seed.activities].reverse());

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
