import { BrowserProvider, Contract } from "ethers";

// =====================================================
// PLACEHOLDER: Replace with your deployed contract details
// =====================================================
const CONTRACT_ADDRESS = "0xYOUR_CONTRACT_ADDRESS_HERE";
const CONTRACT_ABI = [
  "function createBirthRecord(string,string,string,string,string,string,string,string,string) public returns (uint256)",
  "function approveCertificate(uint256) public",
  "function verifyCertificate(uint256) public view returns (string,string,string,string,string,string,bool)",
];

const IS_DEMO_MODE = CONTRACT_ADDRESS === "0xYOUR_CONTRACT_ADDRESS_HERE";

function generateMockTxHash(): string {
  return "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
}

// In-memory demo storage
const demoRecords: Map<number, BirthRecord & { approved: boolean }> = new Map();

export interface WalletState {
  address: string | null;
  connected: boolean;
}

export interface BirthRecord {
  fatherName: string;
  motherName: string;
  babyName: string;
  birthDate: string;
  birthTime: string;
  gender: string;
  permanentAddress: string;
  doctorName: string;
  hospitalAddress: string;
}

export interface CertificateData {
  fatherName: string;
  motherName: string;
  babyName: string;
  birthDate: string;
  hospital: string;
  status: string;
  verified: boolean;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

export async function connectWallet(): Promise<WalletState> {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed. Please install MetaMask to continue.");
  }

  try {
    const provider = new BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    return {
      address: accounts[0],
      connected: true,
    };
  } catch (error: any) {
    throw new Error(error.message || "Failed to connect wallet");
  }
}

function getContract() {
  if (!window.ethereum) throw new Error("MetaMask not found");
  const provider = new BrowserProvider(window.ethereum);
  return provider.getSigner().then((signer) => new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer));
}

let demoIdCounter = 1000;

export async function createBirthRecord(record: BirthRecord): Promise<string> {
  if (IS_DEMO_MODE) {
    await new Promise((r) => setTimeout(r, 1500));
    const id = demoIdCounter++;
    demoRecords.set(id, { ...record, approved: false });
    console.log(`[DEMO] Birth record created with ID: ${id}`);
    return generateMockTxHash();
  }
  try {
    const contract = await getContract();
    const tx = await contract.createBirthRecord(
      record.fatherName, record.motherName, record.babyName,
      record.birthDate, record.birthTime, record.gender,
      record.permanentAddress, record.doctorName, record.hospitalAddress
    );
    const receipt = await tx.wait();
    return receipt.hash;
  } catch (error: any) {
    throw new Error(error.reason || error.message || "Transaction failed");
  }
}

export async function approveCertificate(certificateId: number): Promise<string> {
  if (IS_DEMO_MODE) {
    await new Promise((r) => setTimeout(r, 1200));
    const rec = demoRecords.get(certificateId);
    if (rec) rec.approved = true;
    return generateMockTxHash();
  }
  try {
    const contract = await getContract();
    const tx = await contract.approveCertificate(certificateId);
    const receipt = await tx.wait();
    return receipt.hash;
  } catch (error: any) {
    throw new Error(error.reason || error.message || "Approval failed");
  }
}

export async function verifyCertificate(certificateId: number): Promise<CertificateData> {
  if (IS_DEMO_MODE) {
    await new Promise((r) => setTimeout(r, 1000));
    const rec = demoRecords.get(certificateId);
    if (rec) {
      return {
        fatherName: rec.fatherName, motherName: rec.motherName,
        babyName: rec.babyName, birthDate: rec.birthDate,
        hospital: rec.hospitalAddress,
        status: rec.approved ? "Approved" : "Pending",
        verified: rec.approved,
      };
    }
    // Return sample data for any ID in demo mode
    return {
      fatherName: "John Doe", motherName: "Jane Doe",
      babyName: "Baby Doe", birthDate: "2026-01-15",
      hospital: "City General Hospital",
      status: "Pending", verified: false,
    };
  }
  try {
    const contract = await getContract();
    const result = await contract.verifyCertificate(certificateId);
    return {
      fatherName: result[0], motherName: result[1],
      babyName: result[2], birthDate: result[3],
      hospital: result[4],
      status: result[6] ? "Approved" : "Pending",
      verified: result[6],
    };
  } catch (error: any) {
    throw new Error(error.reason || error.message || "Verification failed");
  }
}

export function isDemoMode(): boolean {
  return IS_DEMO_MODE;
}
