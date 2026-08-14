"use client";

import Link from "next/link";
import { useState } from "react";
import {
  getMaterialStatus,
  getMaterials,
  saveMaterials,
} from "@/lib/materials";

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
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Data Material",
    href: "/material",
  },
  {
    name: "Pengecekan Stok",
    href: "/pengecekan-stok",
  },
  {
    name: "Pengadaan Material",
    href: "/pengadaan",
  },
  {
    name: "Persetujuan Pengadaan",
    href: "/persetujuan-pengadaan",
  },
  {
    name: "Riwayat Transaksi",
    href: "/riwayat-transaksi",
  },
];

export default function TambahMaterialPage() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [stock, setStock] = useState("");
  const [unit, setUnit] = useState("");
  const [minimum, setMinimum] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    const stockNumber = Number(stock);
    const minimumNumber = Number(minimum);

    if (!name || !type || !stock || !unit || !minimum) {
      setMessage("Semua field harus diisi.");
      return;
    }

    if (stockNumber < 0 || minimumNumber < 0) {
      setMessage("Jumlah stok tidak boleh bernilai negatif.");
      return;
    }

    const existingMaterials = getMaterials();

    const newMaterial = {
      id: String(existingMaterials.length + 1).padStart(2, "0"),
      name,
      type,
      stock: stockNumber,
      unit,
      minimum: minimumNumber,
      status: getMaterialStatus(stockNumber, minimumNumber),
    };

    saveMaterials([...existingMaterials, newMaterial]);

    setMessage("Material berhasil ditambahkan.");

    setName("");
    setType("");
    setStock("");
    setUnit("");
    setMinimum("");
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
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`sidebar-item ${
                item.name === "Data Material" ? "active" : ""
              }`}
            >
              <span className="sidebar-icon">
                {item.name === "Dashboard" && (
                  <Icon>
                    <rect x="4" y="7" width="16" height="13" rx="2" />
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
                    <rect x="5" y="4" width="14" height="17" rx="2" />
                    <path d="M9 2v4M15 2v4M8 10h8" />
                  </Icon>
                )}
              </span>

              <span>{item.name}</span>
            </Link>
          ))}
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
                <rect x="3" y="5" width="18" height="14" rx="3" />
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
          <div className="breadcrumb">
            <Link href="/material">Data Material</Link>
            <span>/</span>
            <strong>Tambah Material</strong>
          </div>

          <div className="page-title-simple">
            <h1>Tambah Material</h1>
          </div>

          <div className="form-card">
            <form onSubmit={handleSubmit}>
              <div className="form-field full">
                <label htmlFor="name">Nama Material</label>

                <input
                  id="name"
                  type="text"
                  placeholder="Masukkan nama material"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-field full">
                <label htmlFor="type">Jenis Material</label>

                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="">Pilih jenis material</option>
                  <option value="Aluminium">Aluminium</option>
                  <option value="Perlengkapan">Perlengkapan</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="stock">Jumlah material</label>

                  <input
                    id="stock"
                    type="number"
                    min="0"
                    placeholder="Masukkan jumlah stok"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="unit">Satuan</label>

                  <select
                    id="unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  >
                    <option value="">Pilih satuan</option>
                    <option value="Batang">Batang</option>
                    <option value="Lembar">Lembar</option>
                    <option value="Roll">Roll</option>
                    <option value="Pcs">Pcs</option>
                    <option value="Tube">Tube</option>
                  </select>
                </div>
              </div>

              <div className="form-field minimum-field">
                <label htmlFor="minimum">Batas Minimum Stok</label>

                <input
                  id="minimum"
                  type="number"
                  min="0"
                  placeholder="Masukkan batas minimum stok"
                  value={minimum}
                  onChange={(e) => setMinimum(e.target.value)}
                />
              </div>

              {message && (
                <div
                  className={`form-message ${
                    message.includes("berhasil") ? "success" : "error"
                  }`}
                >
                  {message}
                </div>
              )}

              <div className="form-actions">
                <button type="submit" className="save-button">
                  Simpan
                </button>

                <Link href="/material" className="cancel-button">
                  Batal
                </Link>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}