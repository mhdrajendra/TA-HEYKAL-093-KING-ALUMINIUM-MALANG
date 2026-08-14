export type MaterialStatus = "Aman" | "Rendah" | "Kosong";

export type Material = {
  id: string;
  name: string;
  type: string;
  stock: number;
  unit: string;
  minimum: number;
  status: MaterialStatus;
};

export const defaultMaterials: Material[] = [
  {
    id: "01",
    name: "Aluminium Hollow",
    type: "Aluminium",
    stock: 100,
    unit: "Batang",
    minimum: 20,
    status: "Aman",
  },
  {
    id: "02",
    name: "Aluminium Plate",
    type: "Aluminium",
    stock: 80,
    unit: "Lembar",
    minimum: 15,
    status: "Aman",
  },
  {
    id: "03",
    name: "Aluminium Pipa",
    type: "Aluminium",
    stock: 25,
    unit: "Batang",
    minimum: 30,
    status: "Rendah",
  },
  {
    id: "04",
    name: "Aluminium Batang",
    type: "Aluminium",
    stock: 0,
    unit: "Batang",
    minimum: 10,
    status: "Kosong",
  },
  {
    id: "05",
    name: "Aluminium Siku",
    type: "Aluminium",
    stock: 45,
    unit: "Batang",
    minimum: 20,
    status: "Aman",
  },
  {
    id: "06",
    name: "Aluminium Strip",
    type: "Aluminium",
    stock: 12,
    unit: "Roll",
    minimum: 15,
    status: "Rendah",
  },
  {
    id: "07",
    name: "Aluminium Besi",
    type: "Aluminium",
    stock: 0,
    unit: "Batang",
    minimum: 20,
    status: "Kosong",
  },
];

export function getMaterialStatus(
  stock: number,
  minimum: number
): MaterialStatus {
  if (stock === 0) {
    return "Kosong";
  }

  if (stock <= minimum) {
    return "Rendah";
  }

  return "Aman";
}

export function getMaterials(): Material[] {
  if (typeof window === "undefined") {
    return defaultMaterials;
  }

  const stored = localStorage.getItem("king-aluminium-materials");

  if (!stored) {
    localStorage.setItem(
      "king-aluminium-materials",
      JSON.stringify(defaultMaterials)
    );

    return defaultMaterials;
  }

  try {
    return JSON.parse(stored) as Material[];
  } catch {
    localStorage.setItem(
      "king-aluminium-materials",
      JSON.stringify(defaultMaterials)
    );

    return defaultMaterials;
  }
}

export function saveMaterials(materials: Material[]) {
  localStorage.setItem(
    "king-aluminium-materials",
    JSON.stringify(materials)
  );
}