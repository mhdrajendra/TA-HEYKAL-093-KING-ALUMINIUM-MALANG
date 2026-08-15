"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  getMaterials,
  saveMaterials,
  type Material,
  type MaterialStatus,
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

  const lowStock = materials.filter(
    (material) => material.status === "Rendah"
  ).length;

  const emptyStock = materials.filter(
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
                <strong>{lowStock}</strong>
              </div>

              <div className="material-stat-icon">
                <StatusIcon status="Rendah" />
              </div>
            </div>

            <div className="material-stat red">
              <div>
                <span>Tidak ada Stok</span>
                <strong>{emptyStock}</strong>
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

              <button className="export-button">
                <Icon size={18}>
                  <path d="M12 3v11" />
                  <path d="m8 10 4 4 4-4" />
                  <path d="M5 19h14" />
                </Icon>

                Export Excel
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