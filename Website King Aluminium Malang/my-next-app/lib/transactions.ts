export type TransactionType =
  | "Material Masuk"
  | "Material Keluar"
  | "Pengadaan Diajukan"
  | "Pengadaan Disetujui"
  | "Pengadaan Ditolak";

export type Transaction = {
  id: string;
  date: string;
  time: string;
  type: TransactionType;
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  description: string;
  user: string;
};

export const defaultTransactions: Transaction[] = [
  {
    id: "TRX-001",
    date: "2026-04-29",
    time: "10:30",
    type: "Material Masuk",
    materialId: "01",
    materialName: "Aluminium Hollow",
    quantity: 50,
    unit: "Batang",
    description: "Material diterima dari supplier.",
    user: "Admin",
  },
  {
    id: "TRX-002",
    date: "2026-04-29",
    time: "09:15",
    type: "Material Keluar",
    materialId: "02",
    materialName: "Aluminium Plate",
    quantity: 30,
    unit: "Lembar",
    description: "Material digunakan untuk produksi.",
    user: "Admin",
  },
  {
    id: "TRX-003",
    date: "2026-04-28",
    time: "16:40",
    type: "Pengadaan Diajukan",
    materialId: "03",
    materialName: "Aluminium Pipa",
    quantity: 100,
    unit: "Batang",
    description: "Pengadaan diajukan karena stok menipis.",
    user: "Admin",
  },
];

export function getTransactions(): Transaction[] {
  if (typeof window === "undefined") {
    return defaultTransactions;
  }

  const stored = localStorage.getItem(
    "king-aluminium-transactions"
  );

  if (!stored) {
    localStorage.setItem(
      "king-aluminium-transactions",
      JSON.stringify(defaultTransactions)
    );

    return defaultTransactions;
  }

  try {
    return JSON.parse(stored) as Transaction[];
  } catch {
    localStorage.setItem(
      "king-aluminium-transactions",
      JSON.stringify(defaultTransactions)
    );

    return defaultTransactions;
  }
}

export function saveTransactions(
  transactions: Transaction[]
) {
  localStorage.setItem(
    "king-aluminium-transactions",
    JSON.stringify(transactions)
  );
}

export function addTransaction(
  transaction: Transaction
) {
  const transactions = getTransactions();

  saveTransactions([
    transaction,
    ...transactions,
  ]);
}

export function generateTransactionId(): string {
  const transactions = getTransactions();

  return `TRX-${String(
    transactions.length + 1
  ).padStart(3, "0")}`;
}