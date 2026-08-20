"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx-js-style";

import {
  getMaterials,
  saveMaterials,
  type Material,
  type MaterialStatus,
} from "@/lib/materials";

import {
  getTransactions,
} from "@/lib/transactions";

import {
  getProcurements,
} from "@/lib/procurements";

function Icon({
  children,
  size = 22,
}: {
  children: React.ReactNode;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function SearchIcon() {
  return (
    <Icon size={22}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </Icon>
  );
}

function MaterialIcon() {
  return (
    <Icon size={24}>
      <path d="m12 3-8 4 8 4 8-4-8-4Z" />
      <path d="m4 12 8 4 8-4" />
      <path d="m4 17 8 4 8-4" />
    </Icon>
  );
}

function StatusIcon({
  status,
}: {
  status: MaterialStatus;
}) {
  if (status === "Aman") {
    return (
      <Icon size={17}>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 3 3 5-6" />
      </Icon>
    );
  }

  if (status === "Rendah") {
    return (
      <Icon size={17}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v6M12 16v1" />
      </Icon>
    );
  }

  return (
    <Icon size={17}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 12h8" />
    </Icon>
  );
}

function TransactionIcon({
  type,
}: {
  type: "in" | "out";
}) {
  return (
    <Icon size={17}>
      {type === "in" ? (
        <>
          <path d="M12 4v11" />
          <path d="m7 11 5 5 5-5" />
        </>
      ) : (
        <>
          <path d="M12 20V9" />
          <path d="m7 13 5-5 5 5" />
        </>
      )}
    </Icon>
  );
}

export default function MaterialPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState("Semua Kategori");

  useEffect(() => {
    setMaterials(getMaterials());
  }, []);

  const filteredMaterials = materials.filter(
    (material) => {
      const matchesSearch = material.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "Semua Kategori" ||
        material.type === category;

      return matchesSearch && matchesCategory;
    }
  );

  const totalMaterial = materials.length;

  const stokAman = materials.filter(
    (material) => material.status === "Aman"
  ).length;

  const stokRendah = materials.filter(
    (material) => material.status === "Rendah"
  ).length;

  const stokKosong = materials.filter(
    (material) => material.status === "Kosong"
  ).length;

  const totalStock = materials.reduce(
    (sum, material) => sum + material.stock,
    0
  );

  const handleDelete = () => {
  if (!deleteTarget) {
    return;
  }

  const updatedMaterials = materials.filter(
    (item) => item.id !== deleteTarget.id
  );

  saveMaterials(updatedMaterials);
  setMaterials(updatedMaterials);
  setDeleteTarget(null);
};

  const [deleteTarget, setDeleteTarget] =
  useState<Material | null>(null);

  const [showExportModal, setShowExportModal] = useState(false);

  const handleExportRekap = () => {
    if (materials.length === 0) {
      alert("Tidak ada data material untuk direkap.");
      setShowExportModal(false);
      return;
    }

    const today = new Date();

    // =====================================================
    // PERIODE REKAP 7 HARI TERAKHIR
    // =====================================================

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 6);

    const toDateString = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    };

    const formatFileDate = (date: Date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}-${month}-${year}`;
    };

    const startDateString = toDateString(startDate);
    const endDateString = toDateString(today);

    // =====================================================
    // DATA TRANSAKSI MINGGUAN
    // =====================================================

    const transactions = getTransactions();

    const weeklyTransactions = transactions
      .filter(
        (transaction) =>
          transaction.date >= startDateString &&
          transaction.date <= endDateString
      )
      .sort((a, b) => {
        const dateA = `${a.date} ${a.time}`;
        const dateB = `${b.date} ${b.time}`;

        return dateB.localeCompare(dateA);
      });

    const materialMasuk = weeklyTransactions.filter(
      (transaction) => transaction.type === "Material Masuk"
    );

    const materialKeluar = weeklyTransactions.filter(
      (transaction) => transaction.type === "Material Keluar"
    );

    const pengadaanDiajukan = weeklyTransactions.filter(
      (transaction) => transaction.type === "Pengadaan Diajukan"
    );

    const pengadaanDisetujui = weeklyTransactions.filter(
      (transaction) => transaction.type === "Pengadaan Disetujui"
    );

    const pengadaanDitolak = weeklyTransactions.filter(
      (transaction) => transaction.type === "Pengadaan Ditolak"
    );

    const totalMasuk = materialMasuk.reduce(
      (total, transaction) => total + transaction.quantity,
      0
    );

    const totalKeluar = materialKeluar.reduce(
      (total, transaction) => total + transaction.quantity,
      0
    );

    // =====================================================
    // DATA PENGADAAN MINGGUAN
    // =====================================================

    const procurements = getProcurements();

    const weeklyProcurements = procurements
      .filter(
        (procurement) =>
          procurement.date >= startDateString &&
          procurement.date <= endDateString
      )
      .sort((a, b) => b.date.localeCompare(a.date));

    // =====================================================
    // RINGKASAN STOK
    // =====================================================

    const totalMaterial = materials.length;

    const totalStock = materials.reduce(
      (total, material) => total + material.stock,
      0
    );

    const stokAman = materials.filter(
      (material) => material.status === "Aman"
    ).length;

    const stokRendah = materials.filter(
      (material) => material.status === "Rendah"
    ).length;

    const stokKosong = materials.filter(
      (material) => material.status === "Kosong"
    ).length;

    // =====================================================
    // WARNA EXCEL
    // =====================================================

    const COLORS = {
      primary: "4A9CAF",
      primaryDark: "347C8C",
      primaryLight: "EAF5F7",

      green: "70A88F",
      greenLight: "EAF5EF",

      orange: "F6B54D",
      orangeLight: "FFF5E5",

      red: "DF666B",
      redLight: "FDECEE",

      purple: "8C82B8",
      purpleLight: "F1EFF9",

      dark: "343844",
      gray: "687080",
      lightGray: "F5F7F9",
      border: "D5D9DE",
      white: "FFFFFF",
    };

    const border = {
      top: {
        style: "thin",
        color: { rgb: COLORS.border },
      },
      bottom: {
        style: "thin",
        color: { rgb: COLORS.border },
      },
      left: {
        style: "thin",
        color: { rgb: COLORS.border },
      },
      right: {
        style: "thin",
        color: { rgb: COLORS.border },
      },
    };

    const applyStyle = (sheet: any, address: string, style: any) => {
      if (!sheet[address]) {
        sheet[address] = {
          t: "s",
          v: "",
        };
      }

      sheet[address].s = {
        ...(sheet[address].s || {}),
        ...style,
      };
    };

    const styleRange = (
      sheet: any,
      startRow: number,
      endRow: number,
      startCol: number,
      endCol: number,
      style: any
    ) => {
      for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
          const address = XLSX.utils.encode_cell({
            r: row,
            c: col,
          });

          applyStyle(sheet, address, style);
        }
      }
    };

    const titleStyle = {
      font: {
        name: "Aptos Display",
        bold: true,
        sz: 18,
        color: { rgb: COLORS.white },
      },
      fill: {
        fgColor: { rgb: COLORS.primaryDark },
      },
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
    };

    const subtitleStyle = {
      font: {
        name: "Aptos",
        bold: true,
        sz: 12,
        color: { rgb: COLORS.dark },
      },
      fill: {
        fgColor: { rgb: COLORS.primaryLight },
      },
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
    };

    const sectionStyle = {
      font: {
        name: "Aptos",
        bold: true,
        sz: 11,
        color: { rgb: COLORS.white },
      },
      fill: {
        fgColor: { rgb: COLORS.primary },
      },
      alignment: {
        horizontal: "left",
        vertical: "center",
      },
      border,
    };

    const headerStyle = {
      font: {
        name: "Aptos",
        bold: true,
        sz: 10,
        color: { rgb: COLORS.white },
      },
      fill: {
        fgColor: { rgb: COLORS.primaryDark },
      },
      alignment: {
        horizontal: "center",
        vertical: "center",
        wrapText: true,
      },
      border,
    };

    const bodyStyle = {
      font: {
        name: "Aptos",
        sz: 10,
        color: { rgb: COLORS.dark },
      },
      alignment: {
        vertical: "center",
      },
      border,
    };

    const centerStyle = {
      ...bodyStyle,
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
    };

    const rightStyle = {
      ...bodyStyle,
      alignment: {
        horizontal: "right",
        vertical: "center",
      },
    };

    const labelStyle = {
      ...bodyStyle,
      font: {
        name: "Aptos",
        bold: true,
        sz: 10,
        color: { rgb: COLORS.dark },
      },
      fill: {
        fgColor: { rgb: COLORS.lightGray },
      },
    };

    const valueStyle = {
      ...bodyStyle,
      font: {
        name: "Aptos",
        bold: true,
        sz: 10,
        color: { rgb: COLORS.primaryDark },
      },
      alignment: {
        horizontal: "right",
        vertical: "center",
      },
    };

    const noteStyle = {
      font: {
        name: "Aptos",
        italic: true,
        sz: 9,
        color: { rgb: COLORS.gray },
      },
      fill: {
        fgColor: { rgb: COLORS.lightGray },
      },
      alignment: {
        vertical: "center",
        wrapText: true,
      },
      border,
    };

    const setSheetTitle = (
      sheet: any,
      lastColumn: string,
      title: string
    ) => {
      sheet["!merges"] = [
        {
          s: { r: 0, c: 0 },
          e: {
            r: 0,
            c: XLSX.utils.decode_col(lastColumn),
          },
        },
        {
          s: { r: 1, c: 0 },
          e: {
            r: 1,
            c: XLSX.utils.decode_col(lastColumn),
          },
        },
      ];

      applyStyle(sheet, "A1", titleStyle);
      applyStyle(sheet, "A2", subtitleStyle);

      sheet["!rows"] = [
        { hpt: 30 },
        { hpt: 24 },
        { hpt: 8 },
      ];
    };

    // =====================================================
    // SHEET 1 — RINGKASAN MINGGUAN
    // =====================================================

    const ringkasanData = [
      ["KING ALUMINIUM MALANG", "", "", "", "", ""],
      ["REKAP MINGGUAN SISTEM PENGECEKAN STOK MATERIAL", "", "", "", "", ""],
      ["", "", "", "", "", ""],
      ["Periode Rekap", `${formatDate(startDate)} - ${formatDate(today)}`, "", "", "", ""],
      ["Tanggal Dibuat", formatDate(today), "", "", "", ""],
      ["", "", "", "", "", ""],
      ["RINGKASAN STOK", "", "", "", "", ""],
      ["Total Jenis Material", totalMaterial, "", "", "", ""],
      ["Total Stok", totalStock, "", "", "", ""],
      ["Stok Aman", stokAman, "", "", "", ""],
      ["Stok Menipis", stokRendah, "", "", "", ""],
      ["Stok Habis", stokKosong, "", "", "", ""],
      ["", "", "", "", "", ""],
      ["AKTIVITAS MINGGUAN", "", "", "", "", ""],
      ["Material Masuk", materialMasuk.length, "", "", "", ""],
      ["Total Material Masuk", totalMasuk, "", "", "", ""],
      ["Material Keluar", materialKeluar.length, "", "", "", ""],
      ["Total Material Keluar", totalKeluar, "", "", "", ""],
      ["", "", "", "", "", ""],
      ["PENGADAAN MINGGUAN", "", "", "", "", ""],
      ["Pengadaan Diajukan", pengadaanDiajukan.length, "", "", "", ""],
      ["Pengadaan Disetujui", pengadaanDisetujui.length, "", "", "", ""],
      ["Pengadaan Ditolak", pengadaanDitolak.length, "", "", "", ""],
      ["Total Data Pengadaan", weeklyProcurements.length, "", "", "", ""],
      ["", "", "", "", "", ""],
      [
        "Keterangan",
        "Rekap mencakup kondisi stok terbaru dan seluruh aktivitas selama 7 hari terakhir.",
        "",
        "",
        "",
        "",
      ],
    ];

    const ringkasanSheet = XLSX.utils.aoa_to_sheet(ringkasanData);

    setSheetTitle(
      ringkasanSheet,
      "F",
      "KING ALUMINIUM MALANG"
    );

    ringkasanSheet["!merges"] = [
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: 5 },
      },
      {
        s: { r: 1, c: 0 },
        e: { r: 1, c: 5 },
      },
      {
        s: { r: 6, c: 0 },
        e: { r: 6, c: 5 },
      },
      {
        s: { r: 13, c: 0 },
        e: { r: 13, c: 5 },
      },
      {
        s: { r: 19, c: 0 },
        e: { r: 19, c: 5 },
      },
      {
        s: { r: 25, c: 1 },
        e: { r: 25, c: 5 },
      },
    ];

    styleRange(ringkasanSheet, 3, 4, 0, 1, bodyStyle);
    styleRange(ringkasanSheet, 7, 11, 0, 1, bodyStyle);
    styleRange(ringkasanSheet, 14, 17, 0, 1, bodyStyle);
    styleRange(ringkasanSheet, 20, 23, 0, 1, bodyStyle);

    styleRange(ringkasanSheet, 3, 4, 0, 0, labelStyle);
    styleRange(ringkasanSheet, 7, 11, 0, 0, labelStyle);
    styleRange(ringkasanSheet, 14, 17, 0, 0, labelStyle);
    styleRange(ringkasanSheet, 20, 23, 0, 0, labelStyle);

    styleRange(ringkasanSheet, 3, 4, 1, 1, valueStyle);
    styleRange(ringkasanSheet, 7, 11, 1, 1, valueStyle);
    styleRange(ringkasanSheet, 14, 17, 1, 1, valueStyle);
    styleRange(ringkasanSheet, 20, 23, 1, 1, valueStyle);

    styleRange(ringkasanSheet, 25, 25, 0, 0, labelStyle);
    styleRange(ringkasanSheet, 25, 25, 1, 5, noteStyle);

    applyStyle(ringkasanSheet, "B10", {
      ...valueStyle,
      font: {
        name: "Aptos",
        bold: true,
        sz: 10,
        color: { rgb: COLORS.green },
      },
      fill: {
        fgColor: { rgb: COLORS.greenLight },
      },
    });

    applyStyle(ringkasanSheet, "B11", {
      ...valueStyle,
      font: {
        name: "Aptos",
        bold: true,
        sz: 10,
        color: { rgb: COLORS.orange },
      },
      fill: {
        fgColor: { rgb: COLORS.orangeLight },
      },
    });

    applyStyle(ringkasanSheet, "B12", {
      ...valueStyle,
      font: {
        name: "Aptos",
        bold: true,
        sz: 10,
        color: { rgb: COLORS.red },
      },
      fill: {
        fgColor: { rgb: COLORS.redLight },
      },
    });

    styleRange(ringkasanSheet, 6, 6, 0, 5, sectionStyle);
    styleRange(ringkasanSheet, 13, 13, 0, 5, sectionStyle);
    styleRange(ringkasanSheet, 19, 19, 0, 5, sectionStyle);

    ringkasanSheet["!cols"] = [
      { wch: 30 },
      { wch: 27 },
      { wch: 5 },
      { wch: 5 },
      { wch: 5 },
      { wch: 5 },
    ];

    ringkasanSheet["!rows"] = [
      { hpt: 32 },
      { hpt: 25 },
      { hpt: 8 },
      { hpt: 22 },
      { hpt: 22 },
      { hpt: 8 },
      { hpt: 24 },
      { hpt: 22 },
      { hpt: 22 },
      { hpt: 22 },
      { hpt: 22 },
      { hpt: 22 },
      { hpt: 8 },
      { hpt: 24 },
      { hpt: 22 },
      { hpt: 22 },
      { hpt: 22 },
      { hpt: 22 },
      { hpt: 8 },
      { hpt: 24 },
      { hpt: 22 },
      { hpt: 22 },
      { hpt: 22 },
      { hpt: 22 },
      { hpt: 8 },
      { hpt: 35 },
    ];

    // =====================================================
    // SHEET 2 — REKAP STOK
    // =====================================================

    const stokData = [
      [
        "No",
        "ID",
        "Material",
        "Satuan",
        "Stok Saat Ini",
        "Stok Minimum",
        "Status",
      ],
      ...materials.map((material, index) => [
        index + 1,
        material.id,
        material.name,
        material.unit,
        material.stock,
        material.minimum,
        material.status,
      ]),
    ];

    const stokSheet = XLSX.utils.aoa_to_sheet(stokData);

    stokSheet["!merges"] = [
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: 6 },
      },
      {
        s: { r: 1, c: 0 },
        e: { r: 1, c: 6 },
      },
    ];

    // Tambahkan title row di atas tabel.
    XLSX.utils.sheet_add_aoa(
      stokSheet,
      [
        ["KING ALUMINIUM MALANG"],
        [
          `REKAP STOK MATERIAL — ${formatDate(today)}`,
        ],
      ],
      { origin: "A1" }
    );

    // Geser tabel agar header dimulai pada baris 5.
    const stokRows = [
      [
        "No",
        "ID",
        "Material",
        "Satuan",
        "Stok Saat Ini",
        "Stok Minimum",
        "Status",
      ],
      ...materials.map((material, index) => [
        index + 1,
        material.id,
        material.name,
        material.unit,
        material.stock,
        material.minimum,
        material.status,
      ]),
    ];

    const styledStokSheet = XLSX.utils.aoa_to_sheet([
      ["KING ALUMINIUM MALANG", "", "", "", "", "", ""],
      [
        `REKAP STOK MATERIAL — ${formatDate(today)}`,
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      [""],
      [""],
      ...stokRows,
    ]);

    styledStokSheet["!merges"] = [
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: 6 },
      },
      {
        s: { r: 1, c: 0 },
        e: { r: 1, c: 6 },
      },
    ];

    applyStyle(styledStokSheet, "A1", titleStyle);
    applyStyle(styledStokSheet, "A2", subtitleStyle);

    styleRange(
      styledStokSheet,
      4,
      4,
      0,
      6,
      headerStyle
    );

    if (materials.length > 0) {
      styleRange(
        styledStokSheet,
        5,
        materials.length + 4,
        0,
        6,
        bodyStyle
      );
    }

    for (let row = 5; row <= materials.length + 4; row++) {
      applyStyle(styledStokSheet, `A${row}`, centerStyle);
      applyStyle(styledStokSheet, `B${row}`, centerStyle);
      applyStyle(styledStokSheet, `D${row}`, centerStyle);
      applyStyle(styledStokSheet, `E${row}`, rightStyle);
      applyStyle(styledStokSheet, `F${row}`, rightStyle);

      const status = materials[row - 5]?.status;

      if (status === "Aman") {
        applyStyle(styledStokSheet, `G${row}`, {
          ...centerStyle,
          font: {
            name: "Aptos",
            bold: true,
            color: { rgb: COLORS.green },
          },
          fill: {
            fgColor: { rgb: COLORS.greenLight },
          },
        });
      }

      if (status === "Rendah") {
        applyStyle(styledStokSheet, `G${row}`, {
          ...centerStyle,
          font: {
            name: "Aptos",
            bold: true,
            color: { rgb: COLORS.orange },
          },
          fill: {
            fgColor: { rgb: COLORS.orangeLight },
          },
        });
      }

      if (status === "Kosong") {
        applyStyle(styledStokSheet, `G${row}`, {
          ...centerStyle,
          font: {
            name: "Aptos",
            bold: true,
            color: { rgb: COLORS.red },
          },
          fill: {
            fgColor: { rgb: COLORS.redLight },
          },
        });
      }
    }

    styledStokSheet["!autofilter"] = {
      ref: `A5:G${materials.length + 4}`,
    };

    styledStokSheet["!freeze"] = {
      xSplit: 0,
      ySplit: 5,
    };

    styledStokSheet["!cols"] = [
      { wch: 7 },
      { wch: 12 },
      { wch: 30 },
      { wch: 15 },
      { wch: 18 },
      { wch: 18 },
      { wch: 16 },
    ];

    styledStokSheet["!rows"] = [
      { hpt: 32 },
      { hpt: 24 },
      { hpt: 7 },
      { hpt: 7 },
      { hpt: 28 },
    ];

    // =====================================================
    // SHEET 3 — AKTIVITAS MINGGUAN
    // =====================================================

    const aktivitasHeaders = [
      "No",
      "ID Transaksi",
      "Tanggal",
      "Waktu",
      "Jenis Aktivitas",
      "ID Material",
      "Material",
      "Jumlah",
      "Satuan",
      "User",
      "Keterangan",
    ];

    const aktivitasRows = weeklyTransactions.map(
      (transaction, index) => [
        index + 1,
        transaction.id,
        transaction.date,
        transaction.time,
        transaction.type,
        transaction.materialId,
        transaction.materialName,
        transaction.quantity,
        transaction.unit,
        transaction.user,
        transaction.description,
      ]
    );

    const aktivitasSheet = XLSX.utils.aoa_to_sheet([
      ["KING ALUMINIUM MALANG", "", "", "", "", "", "", "", "", "", ""],
      [
        `AKTIVITAS MINGGUAN — ${formatDate(startDate)} - ${formatDate(today)}`,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      [""],
      [""],
      aktivitasHeaders,
      ...(aktivitasRows.length > 0
        ? aktivitasRows
        : [["-", "-", "-", "-", "Tidak ada aktivitas", "-", "-", 0, "-", "-", "-"]]),
    ]);

    aktivitasSheet["!merges"] = [
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: 10 },
      },
      {
        s: { r: 1, c: 0 },
        e: { r: 1, c: 10 },
      },
    ];

    applyStyle(aktivitasSheet, "A1", titleStyle);
    applyStyle(aktivitasSheet, "A2", subtitleStyle);

    styleRange(aktivitasSheet, 4, 4, 0, 10, headerStyle);

    const aktivitasLastRow =
      weeklyTransactions.length > 0
        ? weeklyTransactions.length + 4
        : 5;

    styleRange(
      aktivitasSheet,
      5,
      aktivitasLastRow,
      0,
      10,
      bodyStyle
    );

    for (let row = 5; row <= aktivitasLastRow; row++) {
      applyStyle(aktivitasSheet, `A${row}`, centerStyle);
      applyStyle(aktivitasSheet, `B${row}`, centerStyle);
      applyStyle(aktivitasSheet, `C${row}`, centerStyle);
      applyStyle(aktivitasSheet, `D${row}`, centerStyle);
      applyStyle(aktivitasSheet, `F${row}`, centerStyle);
      applyStyle(aktivitasSheet, `H${row}`, rightStyle);
      applyStyle(aktivitasSheet, `I${row}`, centerStyle);
      applyStyle(aktivitasSheet, `J${row}`, centerStyle);

      const type = weeklyTransactions[row - 5]?.type;

      if (type === "Material Masuk" || type === "Pengadaan Disetujui") {
        applyStyle(aktivitasSheet, `E${row}`, {
          ...centerStyle,
          font: {
            name: "Aptos",
            bold: true,
            color: { rgb: COLORS.green },
          },
          fill: {
            fgColor: { rgb: COLORS.greenLight },
          },
        });
      }

      if (type === "Material Keluar" || type === "Pengadaan Ditolak") {
        applyStyle(aktivitasSheet, `E${row}`, {
          ...centerStyle,
          font: {
            name: "Aptos",
            bold: true,
            color: { rgb: COLORS.red },
          },
          fill: {
            fgColor: { rgb: COLORS.redLight },
          },
        });
      }

      if (type === "Pengadaan Diajukan") {
        applyStyle(aktivitasSheet, `E${row}`, {
          ...centerStyle,
          font: {
            name: "Aptos",
            bold: true,
            color: { rgb: COLORS.orange },
          },
          fill: {
            fgColor: { rgb: COLORS.orangeLight },
          },
        });
      }
    }

    aktivitasSheet["!autofilter"] = {
      ref: `A5:K${aktivitasLastRow}`,
    };

    aktivitasSheet["!freeze"] = {
      xSplit: 0,
      ySplit: 5,
    };

    aktivitasSheet["!cols"] = [
      { wch: 7 },
      { wch: 16 },
      { wch: 14 },
      { wch: 10 },
      { wch: 25 },
      { wch: 15 },
      { wch: 30 },
      { wch: 12 },
      { wch: 14 },
      { wch: 15 },
      { wch: 42 },
    ];

    aktivitasSheet["!rows"] = [
      { hpt: 32 },
      { hpt: 24 },
      { hpt: 7 },
      { hpt: 7 },
      { hpt: 30 },
    ];

    // =====================================================
    // SHEET 4 — PENGADAAN MINGGUAN
    // =====================================================

    const pengadaanHeaders = [
      "No",
      "ID Pengadaan",
      "Tanggal",
      "Material",
      "Jumlah",
      "Satuan",
      "Supplier",
      "Pemohon",
      "Status",
      "Keterangan",
    ];

    const pengadaanRows = weeklyProcurements.map(
      (procurement, index) => [
        index + 1,
        procurement.id,
        procurement.date,
        procurement.materialName,
        procurement.quantity,
        procurement.unit,
        procurement.supplier,
        procurement.requester,
        procurement.status,
        procurement.note || "-",
      ]
    );

    const pengadaanSheet = XLSX.utils.aoa_to_sheet([
      ["KING ALUMINIUM MALANG", "", "", "", "", "", "", "", "", ""],
      [
        `PENGADAAN MINGGUAN — ${formatDate(startDate)} - ${formatDate(today)}`,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      [""],
      [""],
      pengadaanHeaders,
      ...(pengadaanRows.length > 0
        ? pengadaanRows
        : [["-", "-", "-", "-", 0, "-", "-", "-", "Tidak ada data", "-"]]),
    ]);

    pengadaanSheet["!merges"] = [
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: 9 },
      },
      {
        s: { r: 1, c: 0 },
        e: { r: 1, c: 9 },
      },
    ];

    applyStyle(pengadaanSheet, "A1", titleStyle);
    applyStyle(pengadaanSheet, "A2", subtitleStyle);

    styleRange(pengadaanSheet, 4, 4, 0, 9, headerStyle);

    const pengadaanLastRow =
      weeklyProcurements.length > 0
        ? weeklyProcurements.length + 4
        : 5;

    styleRange(
      pengadaanSheet,
      5,
      pengadaanLastRow,
      0,
      9,
      bodyStyle
    );

    for (let row = 5; row <= pengadaanLastRow; row++) {
      applyStyle(pengadaanSheet, `A${row}`, centerStyle);
      applyStyle(pengadaanSheet, `B${row}`, centerStyle);
      applyStyle(pengadaanSheet, `C${row}`, centerStyle);
      applyStyle(pengadaanSheet, `E${row}`, rightStyle);
      applyStyle(pengadaanSheet, `F${row}`, centerStyle);
      applyStyle(pengadaanSheet, `H${row}`, centerStyle);

      const status = weeklyProcurements[row - 5]?.status;

      if (status === "Menunggu") {
        applyStyle(pengadaanSheet, `I${row}`, {
          ...centerStyle,
          font: {
            name: "Aptos",
            bold: true,
            color: { rgb: COLORS.orange },
          },
          fill: {
            fgColor: { rgb: COLORS.orangeLight },
          },
        });
      }

      if (status === "Disetujui" || status === "Selesai") {
        applyStyle(pengadaanSheet, `I${row}`, {
          ...centerStyle,
          font: {
            name: "Aptos",
            bold: true,
            color: { rgb: COLORS.green },
          },
          fill: {
            fgColor: { rgb: COLORS.greenLight },
          },
        });
      }

      if (status === "Ditolak") {
        applyStyle(pengadaanSheet, `I${row}`, {
          ...centerStyle,
          font: {
            name: "Aptos",
            bold: true,
            color: { rgb: COLORS.red },
          },
          fill: {
            fgColor: { rgb: COLORS.redLight },
          },
        });
      }

      if (status === "Diproses") {
        applyStyle(pengadaanSheet, `I${row}`, {
          ...centerStyle,
          font: {
            name: "Aptos",
            bold: true,
            color: { rgb: COLORS.primaryDark },
          },
          fill: {
            fgColor: { rgb: COLORS.primaryLight },
          },
        });
      }
    }

    pengadaanSheet["!autofilter"] = {
      ref: `A5:J${pengadaanLastRow}`,
    };

    pengadaanSheet["!freeze"] = {
      xSplit: 0,
      ySplit: 5,
    };

    pengadaanSheet["!cols"] = [
      { wch: 7 },
      { wch: 18 },
      { wch: 14 },
      { wch: 30 },
      { wch: 12 },
      { wch: 14 },
      { wch: 25 },
      { wch: 20 },
      { wch: 18 },
      { wch: 42 },
    ];

    pengadaanSheet["!rows"] = [
      { hpt: 32 },
      { hpt: 24 },
      { hpt: 7 },
      { hpt: 7 },
      { hpt: 30 },
    ];

    // =====================================================
    // BUAT WORKBOOK
    // =====================================================

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      ringkasanSheet,
      "Ringkasan Mingguan"
    );

    XLSX.utils.book_append_sheet(
      workbook,
      styledStokSheet,
      "Rekap Stok"
    );

    XLSX.utils.book_append_sheet(
      workbook,
      aktivitasSheet,
      "Aktivitas Mingguan"
    );

    XLSX.utils.book_append_sheet(
      workbook,
      pengadaanSheet,
      "Pengadaan Mingguan"
    );

    // =====================================================
    // DOWNLOAD EXCEL
    // =====================================================

    XLSX.writeFile(
      workbook,
      `Rekap_Mingguan_King_Aluminium_${formatFileDate(today)}.xlsx`
    );

    setShowExportModal(false);
  };

  return (
    <div className="page-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-symbol">
            <span>K</span>
            <div className="logo-mark" />
          </div>

          <div className="logo-name">
            <strong>KING ALUMINIUM</strong>
            <span>Sistem Pengecekan</span>
            <span>Stok Material</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          <Link
            href="/dashboard"
            className="sidebar-item"
          >
            <span className="sidebar-icon">
              <Icon>
                <rect
                  x="4"
                  y="7"
                  width="16"
                  height="13"
                  rx="2"
                />
                <path d="M7 7V5a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v2" />
              </Icon>
            </span>

            <span>Dashboard</span>
          </Link>

          <Link
            href="/material"
            className="sidebar-item active"
          >
            <span className="sidebar-icon">
              <Icon>
                <path d="M4 12a8 8 0 1 0 16 0" />
                <path d="M8 14l3-3 2 2 4-5" />
              </Icon>
            </span>

            <span>Data Material</span>
          </Link>

          <Link
            href="/pengecekan-stok"
            className="sidebar-item"
          >
            <span className="sidebar-icon">
              <Icon>
                <path d="M6 3h8l4 4v14H6z" />
                <path d="M14 3v5h5" />
                <circle cx="10" cy="14" r="3" />
              </Icon>
            </span>

            <span>Pengecekan Stok</span>
          </Link>

          <Link
            href="/pengadaan"
            className="sidebar-item"
          >
            <span className="sidebar-icon">
              <Icon>
                <path d="M3 7h11v10H3z" />
                <path d="M14 10h4l3 3v4h-7z" />
                <circle cx="7" cy="19" r="2" />
                <circle cx="18" cy="19" r="2" />
              </Icon>
            </span>

            <span>Pengadaan Material</span>
          </Link>

          <Link
            href="/persetujuan-pengadaan"
            className="sidebar-item"
          >
            <span className="sidebar-icon">
              <Icon>
                <path d="M12 3 4 7l8 4 8-4-8-4Z" />
                <path d="m4 12 8 4 8-4" />
                <path d="m4 17 8 4 8-4" />
              </Icon>
            </span>

            <span>Persetujuan Pengadaan</span>
          </Link>

          <Link
            href="/riwayat-transaksi"
            className="sidebar-item"
          >
            <span className="sidebar-icon">
              <Icon>
                <rect
                  x="5"
                  y="4"
                  width="14"
                  height="17"
                  rx="2"
                />
                <path d="M9 2v4M15 2v4M8 10h8" />
              </Icon>
            </span>

            <span>Riwayat Transaksi</span>
          </Link>
        </nav>

        <Link
          href="/"
          className="logout-button"
        >
          <Icon size={27}>
            <path d="M9 5a7 7 0 1 0 6 0" />
            <path d="M12 2v7" />
          </Icon>

          <span>Logout</span>
        </Link>
      </aside>

      {/* MAIN */}
      <div className="page-main">
        <header className="topbar">
          <div className="search-box">
            <SearchIcon />

            <input
              placeholder="Search..."
              value=""
              readOnly
            />
          </div>

          <div className="topbar-right">
            <button className="topbar-icon">
              <Icon size={25}>
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="3"
                />
                <path d="m4 7 8 6 8-6" />
              </Icon>
            </button>

            <button className="topbar-icon">
              <Icon size={25}>
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                <path d="M10 21h4" />
              </Icon>
            </button>

            <div className="profile">
              <div className="avatar">
                <Icon size={29}>
                  <circle
                    cx="12"
                    cy="8"
                    r="3.5"
                  />
                  <path d="M5 20c.7-3.5 3.1-5 7-5s6.3 1.5 7 5" />
                </Icon>
              </div>

              <span>Admin</span>

              <Icon size={17}>
                <path d="m6 9 6 6 6-6" />
              </Icon>
            </div>
          </div>
        </header>

        <main className="page-content">
          {/* HEADER */}
          <div className="page-heading">
            <div>
              <h1>Data Material</h1>

              <p>
                Kelola data material dan lakukan
                pencatatan material masuk atau keluar.
              </p>
            </div>

            <Link
              href="/material/tambah"
              className="primary-action"
            >
              <Icon size={22}>
                <path d="M12 5v14M5 12h14" />
              </Icon>

              Tambah Material
            </Link>
          </div>

          {/* STAT */}
          <div className="material-stat-grid">
            <div className="material-stat blue">
              <div>
                <span>Total Material</span>
                <strong>{totalMaterial}</strong>
              </div>

              <div className="material-stat-icon">
                <MaterialIcon />
              </div>
            </div>

            <div className="material-stat orange">
              <div>
                <span>Stok Rendah</span>
                <strong>{stokRendah}</strong>
              </div>

              <div className="material-stat-icon">
                <StatusIcon status="Rendah" />
              </div>
            </div>

            <div className="material-stat red">
              <div>
                <span>Tidak ada Stok</span>
                <strong>{stokKosong}</strong>
              </div>

              <div className="material-stat-icon">
                <StatusIcon status="Kosong" />
              </div>
            </div>

            <div className="material-stat green">
              <div>
                <span>Total Stok</span>
                <strong>
                  {totalStock.toLocaleString("id-ID")}
                </strong>
              </div>

              <div className="material-stat-icon">
                <MaterialIcon />
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="material-table-card">
            <div className="table-toolbar">
              <div className="table-search">
                <SearchIcon />

                <input
                  type="text"
                  placeholder="Cari material..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />
              </div>

              <div className="category-select">
                <Icon size={20}>
                  <rect
                    x="4"
                    y="4"
                    width="16"
                    height="16"
                    rx="2"
                  />
                  <path d="M8 9h8M8 12h5M8 15h7" />
                </Icon>

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                >
                  <option>
                    Semua Kategori
                  </option>

                  <option value="Aluminium">
                    Aluminium
                  </option>

                  <option value="Perlengkapan">
                    Perlengkapan
                  </option>
                </select>
              </div>
                  
              <button
                type="button"
                className="export-button"
                onClick={() => setShowExportModal(true)}
              >
                <Icon size={18}>
                  <path d="M12 3v11" />
                  <path d="m8 10 4 4 4-4" />
                  <path d="M5 19h14" />
                </Icon>

                Export Rekap
              </button>
            </div>

            <div className="table-wrapper">
              <table className="material-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Material</th>
                    <th>Satuan</th>
                    <th>Stok Saat Ini</th>
                    <th>Stok Minimum</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredMaterials.length >
                  0 ? (
                    filteredMaterials.map(
                      (material) => (
                        <tr key={material.id}>
                          <td>{material.id}</td>

                          <td>
                            {material.name}
                          </td>

                          <td>
                            {material.unit}
                          </td>

                          <td>
                            {material.stock}
                          </td>

                          <td>
                            {material.minimum}
                          </td>

                          <td>
                            <div
                              className={`status-badge ${material.status.toLowerCase()}`}
                            >
                              <StatusIcon
                                status={
                                  material.status
                                }
                              />

                              {material.status}
                            </div>
                          </td>

                          <td>
                            <div className="material-actions">
                              <Link
                                href={`/material-masuk?id=${material.id}`}
                                className="in-button"
                              >
                                <TransactionIcon
                                  type="in"
                                />

                                Masuk
                              </Link>

                              <Link
                                href={`/material-keluar?id=${material.id}`}
                                className="out-button"
                              >
                                <TransactionIcon
                                  type="out"
                                />

                                Keluar
                              </Link>

                              <button
                              type="button"
                              className="delete-button"
                              onClick={() => setDeleteTarget(material)}
                            >
                              <Icon size={17}>
                                <path d="M3 6h18" />
                                <path d="M8 6V4h8v2" />
                                <path d="M19 6l-1 15H6L5 6" />
                                <path d="M10 11v6M14 11v6" />
                              </Icon>

                              Hapus
                            </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="empty-material-row"
                      >
                        Tidak ada material yang
                        ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              <span>
                Menampilkan{" "}
                {filteredMaterials.length} dari{" "}
                {materials.length} material
              </span>

              <div className="pagination">
                <button disabled>
                  Previous
                </button>

                <button className="current">
                  1
                </button>

                <button>2</button>

                <button>
                  Next&nbsp; →
                </button>

                {showExportModal && (
                  <div className="export-modal-overlay">
                    <div className="export-modal">
                      <div className="export-modal-icon">
                        <Icon size={29}>
                          <path d="M12 3v11" />
                          <path d="m7 10 5 5 5-5" />
                          <path d="M5 20h14" />
                        </Icon>
                      </div>

                      <h2>Unduh Rekap?</h2>

                      <p>
                        Apakah Anda yakin ingin mengunduh
                        rekap data material dalam format Excel?
                      </p>

                      <span className="export-modal-info">
                        Rekap akan berisi data material dan
                        ringkasan stok terbaru.
                      </span>

                      <div className="export-modal-actions">
                        <button
                          type="button"
                          className="export-cancel-button"
                          onClick={() =>
                            setShowExportModal(false)
                          }
                        >
                          Batal
                        </button>

                        <button
                          type="button"
                          className="export-confirm-button"
                          onClick={handleExportRekap}
                        >
                          <Icon size={17}>
                            <path d="M12 3v11" />
                            <path d="m7 10 5 5 5-5" />
                            <path d="M5 20h14" />
                          </Icon>

                          Ya, Unduh
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {deleteTarget && (
                <div className="delete-modal-overlay">
                  <div className="delete-modal">
                    <div className="delete-modal-icon">
                      <Icon size={28}>
                        <path d="M3 6h18" />
                        <path d="M8 6V4h8v2" />
                        <path d="M19 6l-1 15H6L5 6" />
                        <path d="M10 11v6M14 11v6" />
                      </Icon>
                    </div>

                    <h2>Hapus Material?</h2>

                    <p>
                      Apakah Anda yakin ingin menghapus material{" "}
                      <strong>&quot;{deleteTarget.name}&quot;</strong>?
                    </p>

                    <span className="delete-modal-warning">
                      Data material yang dihapus tidak dapat
                      ditampilkan kembali dari daftar ini.
                    </span>

                    <div className="delete-modal-actions">
                      <button
                        type="button"
                        className="delete-cancel-button"
                        onClick={() => setDeleteTarget(null)}
                      >
                        Batal
                      </button>

                      <button
                      type="button"
                      className="delete-confirm-button"
                      onClick={handleDelete}
                    >
                      <Icon size={17}>
                        <path d="M3 6h18" />
                        <path d="M8 6V4h8v2" />
                        <path d="M19 6l-1 15H6L5 6" />
                        <path d="M10 11v6M14 11v6" />
                      </Icon>

                      Ya, Hapus
                    </button>
                    </div>
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}