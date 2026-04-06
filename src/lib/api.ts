// API service layer — connects frontend actions to Express+MongoDB backend
// Set VITE_API_URL in your .env to point to your backend (default: http://localhost:5000)

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

let authToken: string | null = localStorage.getItem("jwt_token");

function setToken(token: string) {
  authToken = token;
  localStorage.setItem("jwt_token", token);
}

export function getToken(): string | null {
  return authToken;
}

export function clearToken() {
  authToken = null;
  localStorage.removeItem("jwt_token");
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "API request failed");
  return data;
}

// ─── Auth ───
export async function apiWalletLogin(address: string, role?: string) {
  const data = await apiFetch("/api/auth/wallet-login", {
    method: "POST",
    body: JSON.stringify({ address, role }),
  });
  setToken(data.token);
  return data;
}

// ─── Records ───
export async function apiCreateRecord(record: {
  fatherName: string; motherName: string; babyName: string;
  birthDate: string; birthTime: string; gender: string;
  permanentAddress: string; doctorName: string; hospitalAddress: string;
  txHash: string; block: number; creatorAddress: string;
}) {
  return apiFetch("/api/records", { method: "POST", body: JSON.stringify(record) });
}

export async function apiApproveRecord(certId: number, txHash: string) {
  return apiFetch(`/api/records/${certId}/approve`, {
    method: "PUT",
    body: JSON.stringify({ txHash }),
  });
}

export async function apiVerifyRecord(certId: number) {
  return apiFetch(`/api/records/${certId}/verify`, { method: "POST" });
}

export async function apiFetchRecords() {
  return apiFetch("/api/records");
}

export async function apiFetchRecord(certId: number) {
  return apiFetch(`/api/records/${certId}`);
}

// ─── Transactions ───
export async function apiFetchTransactions(userId?: string) {
  const query = userId ? `?user_id=${userId}` : "";
  return apiFetch(`/api/transactions${query}`);
}
