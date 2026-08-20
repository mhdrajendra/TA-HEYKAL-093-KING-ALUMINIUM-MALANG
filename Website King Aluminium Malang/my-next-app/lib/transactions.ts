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
  // data default kamu
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

  const numbers = transactions
    .map((transaction) => {
      const match = transaction.id.match(
        /^TRX-(\d+)$/
      );

      return match ? Number(match[1]) : 0;
    })
    .filter((number) => !Number.isNaN(number));

  const nextNumber =
    numbers.length > 0
      ? Math.max(...numbers) + 1
      : 1;

  return `TRX-${String(nextNumber).padStart(3, "0")}`;
}