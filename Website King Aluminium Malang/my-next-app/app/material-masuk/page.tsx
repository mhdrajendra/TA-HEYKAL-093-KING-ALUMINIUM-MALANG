"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  getMaterialStatus,
  getMaterials,
  saveMaterials,
  type Material,
} from "@/lib/materials";
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
  { name: "Riwayat Transaksi", href: "/riwayat-transaksi" },
];

export default function MaterialMasukPage() {
  const searchParams = useSearchParams();

  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState("");
  const [materialType, setMaterialType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [transactionType] = useState("Material Masuk");
  const [transactionDate, setTransactionDate] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  /* =========================================
     LOAD MATERIAL + READ URL PARAMETER
  ========================================= */
  useEffect(() => {
    const loadedMaterials = getMaterials();

    setMaterials(loadedMaterials);

    const materialId = searchParams.get("id");

    if (materialId) {
      const selected = loadedMaterials.find(
        (material) => material.id === materialId
      );

      if (selected) {
        setSelectedMaterialId(selected.id);
        setMaterialType(selected.type);
      }
    }
  }, [searchParams]);

  /* =========================================
     SELECTED MATERIAL
  ========================================= */
  const selectedMaterial = materials.find(
    (material) => material.id === selectedMaterialId
  );

  const currentStock = selectedMaterial?.stock ?? 0;
  const quantityNumber = Number(quantity) || 0;

  const estimatedStock = currentStock + quantityNumber;

  /* =========================================
     CHANGE MATERIAL
  ========================================= */
  const handleMaterialChange = (id: string) => {
    setSelectedMaterialId(id);
    setMessage("");

    const selected = materials.find(
      (material) => material.id === id
    );

    if (selected) {
      setMaterialType(selected.type);
    } else {
      setMaterialType("");
    }
  };

  /* =========================================
     SUBMIT
  ========================================= */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    if (!selectedMaterial) {
      setMessage("Silakan pilih nama material.");
      return;
    }

    if (!quantity || quantityNumber <= 0) {
      setMessage("Jumlah material harus lebih dari 0.");
      return;
    }

    if (!transactionDate) {
      setMessage("Tanggal transaksi harus diisi.");
      return;
    }

    const updatedMaterials = materials.map((material) => {
      if (material.id !== selectedMaterial.id) {
        return material;
      }

      const newStock = material.stock + quantityNumber;

      return {
        ...material,
        stock: newStock,
        status: getMaterialStatus(
          newStock,
          material.minimum
        ),
      };
    });

    saveMaterials(updatedMaterials);
    setMaterials(updatedMaterials);

    addTransaction({
      id: generateTransactionId(),
      date: transactionDate,
      time: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "Material Masuk",
      materialId: selectedMaterial.id,
      materialName: selectedMaterial.name,
      quantity: quantityNumber,
      unit: selectedMaterial.unit,
      description:
        description || "Pencatatan material masuk.",
      user: "Admin",
    });

    setMessage(
      `Transaksi berhasil disimpan. ${selectedMaterial.name} bertambah ${quantityNumber} ${selectedMaterial.unit}.`
    );

    setQuantity("");
    setDescription("");
  };

  return (
    <div className="page-layout">
      {/* =========================================
          SIDEBAR
      ========================================= */}
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
              item.name === "Data Material";

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`sidebar-item ${
                  active ? "active" : ""
                }`}
              >
                <span className="sidebar-icon">
                  {item.name === "Dashboard" && (
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
                  )}

                  {item.name === "Data Material" && (
                    <Icon>
                      <path d="M4 12a8 8 0 1 0 16 0" />
                      <path d="M8 14l3-3 2 2 4-5" />
                    </Icon>
                  )}

                  {item.name === "Pengecekan Stok" && (
                    <Icon>
                      <path d="M6 3h8l4 4v14H6z" />
                      <path d="M14 3v5h5" />
                      <circle cx="10" cy="14" r="3" />
                    </Icon>
                  )}

                  {item.name === "Pengadaan Material" && (
                    <Icon>
                      <path d="M3 7h11v10H3z" />
                      <path d="M14 10h4l3 3v4h-7z" />
                      <circle cx="7" cy="19" r="2" />
                      <circle cx="18" cy="19" r="2" />
                    </Icon>
                  )}

                  {item.name === "Persetujuan Pengadaan" && (
                    <Icon>
                      <path d="M12 3 4 7l8 4 8-4-8-4Z" />
                      <path d="m4 12 8 4 8-4" />
                      <path d="m4 17 8 4 8-4" />
                    </Icon>
                  )}

                  {item.name === "Riwayat Transaksi" && (
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
                  )}
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

      {/* =========================================
          MAIN
      ========================================= */}
      <div className="page-main">
        {/* TOPBAR */}
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

              <Icon size={17}>
                <path d="m6 9 6 6 6-6" />
              </Icon>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="page-content">
          {/* BREADCRUMB */}
          <div className="breadcrumb">
            <Link href="/material">
              Data Material
            </Link>

            <span>/</span>

            <strong>
              Pencatatan Material Masuk
            </strong>
          </div>

          {/* TITLE */}
          <div className="transaction-heading">
            <h1>Pencatatan Material Masuk</h1>

            <p>
              Pencatatan Transaksi Stok Material Masuk.
            </p>
          </div>

          {/* CONTENT GRID */}
          <div className="transaction-layout">
            {/* FORM */}
            <div className="transaction-card">
              <form onSubmit={handleSubmit}>
                <div className="transaction-form-grid">
                  <div className="transaction-form-left">

                    {/* NAMA MATERIAL */}
                    <div className="form-field">
                      <label htmlFor="material-name">
                        Nama Material
                      </label>

                      <select
                        id="material-name"
                        value={selectedMaterialId}
                        onChange={(e) =>
                          handleMaterialChange(
                            e.target.value
                          )
                        }
                      >
                        <option value="">
                          Pilih nama material
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

                    {/* JENIS MATERIAL */}
                    <div className="form-field">
                      <label htmlFor="material-type">
                        Jenis Material
                      </label>

                      <select
                        id="material-type"
                        value={materialType}
                        onChange={(e) =>
                          setMaterialType(
                            e.target.value
                          )
                        }
                      >
                        <option value="">
                          Pilih jenis material
                        </option>

                        <option value="Aluminium">
                          Aluminium
                        </option>

                        <option value="Perlengkapan">
                          Perlengkapan
                        </option>
                      </select>
                    </div>

                    {/* JENIS TRANSAKSI */}
                    <div className="form-field">
                      <label htmlFor="transaction-type">
                        Jenis Transaksi
                      </label>

                      <select
                        id="transaction-type"
                        value={transactionType}
                        disabled
                      >
                        <option>
                          Material Masuk
                        </option>
                      </select>
                    </div>

                    {/* JUMLAH */}
                    <div className="form-field">
                      <label htmlFor="quantity">
                        Jumlah Material
                      </label>

                      <input
                        id="quantity"
                        type="number"
                        min="1"
                        placeholder="Masukkan jumlah material"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(e.target.value)
                        }
                      />
                    </div>

                    {/* TANGGAL */}
                    <div className="form-field">
                      <label htmlFor="transaction-date">
                        Tanggal Transaksi
                      </label>

                      <input
                        id="transaction-date"
                        type="date"
                        value={transactionDate}
                        onChange={(e) =>
                          setTransactionDate(
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* KETERANGAN */}
                    <div className="form-field">
                      <label htmlFor="description">
                        Tujuan/Keterangan
                      </label>

                      <textarea
                        id="description"
                        placeholder="Masukkan tujuan/keterangan"
                        value={description}
                        onChange={(e) =>
                          setDescription(
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* MESSAGE */}
                    {message && (
                      <div
                        className={`form-message ${
                          message.includes(
                            "berhasil"
                          )
                            ? "success"
                            : "error"
                        }`}
                      >
                        {message}
                      </div>
                    )}

                    {/* BUTTON */}
                    <div className="transaction-actions">
                      <button
                        type="submit"
                        className="transaction-save-button"
                      >
                        <Icon size={19}>
                          <path d="m5 12 4 4L19 6" />
                        </Icon>

                        Simpan Transaksi
                      </button>

                      <Link
                        href="/material"
                        className="transaction-cancel-button"
                      >
                        Batal
                      </Link>
                    </div>
                  </div>

                  {/* PREVIEW */}
                  <div className="transaction-preview">
                    <div className="preview-label">
                      Stok Saat Ini
                    </div>

                    <div className="current-stock-card">
                      <div className="current-stock-icon">
                        <Icon size={28}>
                          <path d="m12 3-8 4 8 4 8-4-8-4Z" />
                          <path d="m4 12 8 4 8-4" />
                          <path d="m4 17 8 4 8-4" />
                        </Icon>
                      </div>

                      <strong>
                        {currentStock}
                      </strong>

                      <span>
                        {selectedMaterial?.unit ||
                          "Batang"}
                      </span>
                    </div>

                    <div className="preview-label estimation">
                      Estimasi Stok Setelah Transaksi
                    </div>

                    <div className="estimated-stock-card incoming">
                      <div className="estimated-stock-icon">
                        <Icon size={28}>
                          <path d="M12 4v12" />
                          <path d="m7 11 5 5 5-5" />
                        </Icon>
                      </div>

                      <div>
                        <strong>
                          {estimatedStock}
                        </strong>

                        <span>
                          {selectedMaterial?.unit ||
                            "Batang"}
                        </span>

                        {quantityNumber > 0 && (
                          <small>
                            (Setelah ditambah{" "}
                            {quantityNumber}{" "}
                            {selectedMaterial?.unit ||
                              "satuan"}
                            )
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* INFORMATION */}
            <aside className="material-information-card">
              <h2>Informasi Material</h2>

              <div className="information-item">
                <span>Material</span>

                <strong>
                  {selectedMaterial?.name ||
                    "Aluminium Hollow"}
                </strong>
              </div>

              <div className="information-item">
                <span>Minimum Stok</span>

                <strong>
                  {selectedMaterial?.minimum ?? 20}{" "}
                  {selectedMaterial?.unit ||
                    "Batang"}
                </strong>
              </div>

              <div className="information-item">
                <span>Status</span>

                <div
                  className={`information-status ${
                    selectedMaterial?.status ===
                    "Rendah"
                      ? "warning"
                      : selectedMaterial?.status ===
                        "Kosong"
                      ? "danger"
                      : "safe"
                  }`}
                >
                  <Icon size={17}>
                    {selectedMaterial?.status ===
                    "Kosong" ? (
                      <>
                        <rect
                          x="4"
                          y="4"
                          width="16"
                          height="16"
                          rx="2"
                        />
                        <path d="M8 12h8" />
                      </>
                    ) : selectedMaterial?.status ===
                      "Rendah" ? (
                      <>
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                        />
                        <path d="M12 7v6M12 16v1" />
                      </>
                    ) : (
                      <>
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                        />
                        <path d="m8 12 3 3 5-6" />
                      </>
                    )}
                  </Icon>

                  {selectedMaterial?.status ||
                    "Aman"}
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}