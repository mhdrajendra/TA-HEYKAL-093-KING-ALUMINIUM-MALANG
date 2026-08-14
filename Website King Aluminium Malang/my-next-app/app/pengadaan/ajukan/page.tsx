"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  getMaterials,
  type Material,
} from "@/lib/materials";

import {
  getProcurements,
  saveProcurements,
  type Procurement,
} from "@/lib/procurements";

import {
  addTransaction,
  generateTransactionId,
} from "@/lib/transactions";

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

const menuItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Data Material", href: "/material" },
  { name: "Pengecekan Stok", href: "/pengecekan-stok" },
  { name: "Pengadaan Material", href: "/pengadaan" },
  {
    name: "Persetujuan Pengadaan",
    href: "/persetujuan-pengadaan",
  },
  {
    name: "Riwayat Transaksi",
    href: "/riwayat-transaksi",
  },
];

export default function AjukanPengadaanPage() {
  const searchParams = useSearchParams();

  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] =
    useState("");
  const [quantity, setQuantity] = useState("");
  const [supplier, setSupplier] = useState("");
  const [requestDate, setRequestDate] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadedMaterials = getMaterials();

    setMaterials(loadedMaterials);

    const materialId = searchParams.get("material");

    if (materialId) {
      const selected = loadedMaterials.find(
        (material) => material.id === materialId
      );

      if (selected) {
        setSelectedMaterialId(selected.id);
      }
    }

    setRequestDate(
      new Date().toISOString().split("T")[0]
    );
  }, [searchParams]);

  const selectedMaterial = materials.find(
    (material) => material.id === selectedMaterialId
  );

  const quantityNumber = Number(quantity) || 0;

  const recommendedQuantity = selectedMaterial
    ? Math.max(
        selectedMaterial.minimum * 2 -
          selectedMaterial.stock,
        selectedMaterial.minimum
      )
    : 0;

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setMessage("");

    if (!selectedMaterial) {
      setMessage("Silakan pilih material yang akan diajukan.");
      return;
    }

    if (!quantity || quantityNumber <= 0) {
      setMessage("Jumlah pengadaan harus lebih dari 0.");
      return;
    }

    if (!supplier) {
      setMessage("Silakan pilih supplier.");
      return;
    }

    if (!requestDate) {
      setMessage("Tanggal pengajuan harus diisi.");
      return;
    }

    const existingProcurements = getProcurements();

    const nextNumber = existingProcurements.length + 1;

    const newProcurement: Procurement = {
      id: `PG-${String(nextNumber).padStart(3, "0")}`,
      date: requestDate,
      materialId: selectedMaterial.id,
      materialName: selectedMaterial.name,
      quantity: quantityNumber,
      unit: selectedMaterial.unit,
      supplier,
      requester: "Admin",
      note:
        note ||
        `Pengajuan pengadaan ${selectedMaterial.name} karena stok berada pada atau di bawah batas minimum.`,
      status: "Menunggu",
    };

    saveProcurements([
      ...existingProcurements,
      newProcurement,
    ]);

    /* =========================================
       SIMPAN RIWAYAT PENGADAAN
    ========================================= */

    addTransaction({
      id: generateTransactionId(),
      date: requestDate,
      time: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "Pengadaan Diajukan",
      materialId: selectedMaterial.id,
      materialName: selectedMaterial.name,
      quantity: quantityNumber,
      unit: selectedMaterial.unit,
      description:
        note ||
        "Pengajuan pengadaan material.",
      user: "Admin",
    });

    setMessage(
      `Pengadaan berhasil diajukan dengan nomor ${newProcurement.id}. Menunggu persetujuan.`
    );

    setQuantity("");
    setSupplier("");
    setNote("");
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
          {menuItems.map((item) => {
            const active =
              item.name === "Pengadaan Material";

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`sidebar-item ${
                  active ? "active" : ""
                }`}
              >
                <span className="sidebar-icon">
                  <Icon size={22}>
                    {item.name === "Dashboard" && (
                      <>
                        <rect
                          x="4"
                          y="7"
                          width="16"
                          height="13"
                          rx="2"
                        />
                        <path d="M7 7V5a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v2" />
                      </>
                    )}

                    {item.name === "Data Material" && (
                      <>
                        <path d="M4 12a8 8 0 1 0 16 0" />
                        <path d="M8 14l3-3 2 2 4-5" />
                      </>
                    )}

                    {item.name === "Pengecekan Stok" && (
                      <>
                        <path d="M6 3h8l4 4v14H6z" />
                        <path d="M14 3v5h5" />
                        <circle cx="10" cy="14" r="3" />
                      </>
                    )}

                    {item.name === "Pengadaan Material" && (
                      <>
                        <path d="M3 7h11v10H3z" />
                        <path d="M14 10h4l3 3v4h-7z" />
                        <circle cx="7" cy="19" r="2" />
                        <circle cx="18" cy="19" r="2" />
                      </>
                    )}

                    {item.name === "Persetujuan Pengadaan" && (
                      <>
                        <path d="M12 3 4 7l8 4 8-4-8-4Z" />
                        <path d="m4 12 8 4 8-4" />
                        <path d="m4 17 8 4 8-4" />
                      </>
                    )}

                    {item.name === "Riwayat Transaksi" && (
                      <>
                        <rect
                          x="5"
                          y="4"
                          width="14"
                          height="17"
                          rx="2"
                        />
                        <path d="M9 2v4M15 2v4M8 10h8" />
                      </>
                    )}
                  </Icon>
                </span>

                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <Link href="/" className="logout-button">
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
            <Icon size={23}>
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </Icon>

            <input placeholder="Search..." />
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
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M5 20c.7-3.5 3.1-5 7-5s6.3 1.5 7 5" />
                </Icon>
              </div>

              <span>Admin</span>
            </div>
          </div>
        </header>

        <main className="page-content">
          <div className="breadcrumb">
            <Link href="/pengadaan">
              Pengadaan Material
            </Link>

            <span>/</span>

            <strong>Ajukan Pengadaan</strong>
          </div>

          <div className="procurement-form-heading">
            <div>
              <h1>Ajukan Pengadaan</h1>

              <p>
                Buat pengajuan pengadaan material yang
                membutuhkan penambahan stok.
              </p>
            </div>
          </div>

          <div className="procurement-form-layout">
            <div className="procurement-form-card">
              <form onSubmit={handleSubmit}>
                <div className="form-field">
                  <label htmlFor="material">
                    Nama Material
                  </label>

                  <select
                    id="material"
                    value={selectedMaterialId}
                    onChange={(e) =>
                      setSelectedMaterialId(
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Pilih material
                    </option>

                    {materials.map((material) => (
                      <option
                        key={material.id}
                        value={material.id}
                      >
                        {material.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedMaterial && (
                  <div className="procurement-material-info">
                    <div>
                      <span>Stok Saat Ini</span>
                      <strong>
                        {selectedMaterial.stock}{" "}
                        {selectedMaterial.unit}
                      </strong>
                    </div>

                    <div>
                      <span>Minimum Stok</span>
                      <strong>
                        {selectedMaterial.minimum}{" "}
                        {selectedMaterial.unit}
                      </strong>
                    </div>

                    <div>
                      <span>Status</span>
                      <strong
                        className={
                          selectedMaterial.status ===
                          "Rendah"
                            ? "warning"
                            : "danger"
                        }
                      >
                        {selectedMaterial.status ===
                        "Rendah"
                          ? "Stok Menipis"
                          : "Stok Habis"}
                      </strong>
                    </div>
                  </div>
                )}

                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="quantity">
                      Jumlah Pengadaan
                    </label>

                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      placeholder="Masukkan jumlah"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(e.target.value)
                      }
                    />

                    {selectedMaterial && (
                      <small className="procurement-hint">
                        Rekomendasi minimal:{" "}
                        {recommendedQuantity}{" "}
                        {selectedMaterial.unit}
                      </small>
                    )}
                  </div>

                  <div className="form-field">
                    <label htmlFor="request-date">
                      Tanggal Pengajuan
                    </label>

                    <input
                      id="request-date"
                      type="date"
                      value={requestDate}
                      onChange={(e) =>
                        setRequestDate(e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="supplier">
                    Supplier
                  </label>

                  <select
                    id="supplier"
                    value={supplier}
                    onChange={(e) =>
                      setSupplier(e.target.value)
                    }
                  >
                    <option value="">
                      Pilih supplier
                    </option>

                    <option value="CV Sumber Aluminium">
                      CV Sumber Aluminium
                    </option>

                    <option value="PT Aluminium Jaya">
                      PT Aluminium Jaya
                    </option>

                    <option value="CV Berkah Aluminium">
                      CV Berkah Aluminium
                    </option>

                    <option value="PT Logam Indonesia">
                      PT Logam Indonesia
                    </option>
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="note">
                    Keterangan
                  </label>

                  <textarea
                    id="note"
                    placeholder="Masukkan keterangan atau alasan pengadaan"
                    value={note}
                    onChange={(e) =>
                      setNote(e.target.value)
                    }
                  />
                </div>

                {message && (
                  <div
                    className={`form-message ${
                      message.includes("berhasil")
                        ? "success"
                        : "error"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <div className="procurement-form-actions">
                  <button
                    type="submit"
                    className="submit-procurement-button"
                  >
                    <Icon size={19}>
                      <path d="m5 12 4 4L19 6" />
                    </Icon>

                    Ajukan Pengadaan
                  </button>

                  <Link
                    href="/pengadaan"
                    className="transaction-cancel-button"
                  >
                    Batal
                  </Link>
                </div>
              </form>
            </div>

            <aside className="procurement-request-summary">
              <div className="request-summary-icon">
                <Icon size={28}>
                  <path d="M3 7h11v10H3z" />
                  <path d="M14 10h4l3 3v4h-7z" />
                  <circle cx="7" cy="19" r="2" />
                  <circle cx="18" cy="19" r="2" />
                </Icon>
              </div>

              <h2>Ringkasan Pengajuan</h2>

              <div className="request-summary-row">
                <span>Material</span>

                <strong>
                  {selectedMaterial?.name ||
                    "Belum dipilih"}
                </strong>
              </div>

              <div className="request-summary-row">
                <span>Jumlah</span>

                <strong>
                  {quantityNumber > 0
                    ? `${quantityNumber} ${
                        selectedMaterial?.unit ||
                        ""
                      }`
                    : "-"}
                </strong>
              </div>

              <div className="request-summary-row">
                <span>Supplier</span>

                <strong>{supplier || "-"}</strong>
              </div>

              <div className="request-summary-row">
                <span>Status</span>

                <span className="waiting-status">
                  Menunggu Persetujuan
                </span>
              </div>

              <div className="request-note">
                <Icon size={18}>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 11v5M12 8v.5" />
                </Icon>

                <p>
                  Setelah diajukan, pengadaan akan masuk
                  ke proses persetujuan oleh pihak yang
                  berwenang.
                </p>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}