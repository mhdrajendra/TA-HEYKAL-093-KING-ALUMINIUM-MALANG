export type ProcurementStatus =
  | "Menunggu"
  | "Disetujui"
  | "Ditolak"
  | "Diproses"
  | "Selesai";

export type Procurement = {
  id: string;
  date: string;
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  supplier: string;
  requester: string;
  note: string;
  status: ProcurementStatus;
};

export const defaultProcurements: Procurement[] = [
  {
    id: "PG-001",
    date: "2026-04-29",
    materialId: "03",
    materialName: "Aluminium Pipa",
    quantity: 100,
    unit: "Batang",
    supplier: "CV Sumber Aluminium",
    requester: "Admin",
    note: "Stok material sudah berada di bawah batas minimum.",
    status: "Menunggu",
  },
  {
    id: "PG-002",
    date: "2026-04-28",
    materialId: "04",
    materialName: "Aluminium Batang",
    quantity: 50,
    unit: "Batang",
    supplier: "PT Aluminium Jaya",
    requester: "Admin",
    note: "Stok material habis.",
    status: "Disetujui",
  },
];

export function getProcurements(): Procurement[] {
  if (typeof window === "undefined") {
    return defaultProcurements;
  }

  const stored = localStorage.getItem(
    "king-aluminium-procurements"
  );

  if (!stored) {
    localStorage.setItem(
      "king-aluminium-procurements",
      JSON.stringify(defaultProcurements)
    );

    return defaultProcurements;
  }

  try {
    return JSON.parse(stored) as Procurement[];
  } catch {
    localStorage.setItem(
      "king-aluminium-procurements",
      JSON.stringify(defaultProcurements)
    );

    return defaultProcurements;
  }
}

export function saveProcurements(
  procurements: Procurement[]
) {
  localStorage.setItem(
    "king-aluminium-procurements",
    JSON.stringify(procurements)
  );
}