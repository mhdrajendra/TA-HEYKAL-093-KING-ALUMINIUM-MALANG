"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getMaterials,
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

function StatusIcon({
  status,
}: {
  status: MaterialStatus;
}) {
  if (status === "Aman") {
    return (
      <Icon size={18}>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 3 3 5-6" />
      </Icon>
    );
  }

  if (status === "Rendah") {
    return (
      <Icon size={18}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v6M12 16v1" />
      </Icon>
    );
  }

  return (
    <Icon size={18}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8" />
    </Icon>
  );
}

function getStatusText(status: MaterialStatus) {
  if (status === "Aman") return "Stok Aman";
  if (status === "Rendah") return "Stok Menipis";
  return "Stok Habis";
}

export default function PengecekanStokPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua Status");

  useEffect(() => {
    setMaterials(getMaterials());
  }, []);

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch = material.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "Semua Status" ||
      material.status === filter;

    return matchesSearch && matchesFilter;
  });

  const totalMaterial = materials.length;
  const aman = materials.filter(
    (material) => material.status === "Aman"
  ).length;
  const rendah = materials.filter(
    (material) => material.status === "Rendah"
  ).length;
  const habis = materials.filter(
    (material) => material.status === "Kosong"
  ).length;

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
              item.name === "Pengecekan Stok";

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
                      <path d="m12.5 16.5 2 2" />
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

                  {item.name ===
                    "Persetujuan Pengadaan" && (
                    <Icon>
                      <path d="M12 3 4 7l8 4 8-4-8-4Z" />
                      <path d="m4 12 8 4 8-4" />
                      <path d="m4 17 8 4 8-4" />
                    </Icon>
                  )}

                  {item.name ===
                    "Riwayat Transaksi" && (
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

      {/* MAIN */}
      <div className="page-main">
        {/* TOPBAR */}
        <header className="topbar">
          <div className="search-box">
            <Icon size={23}>
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </Icon>

            <input
              placeholder="Search..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
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
          <div className="stock-heading">
            <div>
              <h1>Pengecekan Stok</h1>
              <p>
                Pantau kondisi stok material berdasarkan
                batas minimum yang telah ditentukan.
              </p>
            </div>

            <button
              className="refresh-button"
              onClick={() =>
                setMaterials(getMaterials())
              }
            >
              <Icon size={18}>
                <path d="M20 11a8 8 0 0 0-14.9-4" />
                <path d="M4 4v5h5" />
                <path d="M4 13a8 8 0 0 0 14.9 4" />
                <path d="M20 20v-5h-5" />
              </Icon>
              Refresh
            </button>
          </div>

          {/* SUMMARY */}
          <section className="stock-summary-grid">
            <div className="stock-summary-card total">
              <div className="stock-summary-icon">
                <Icon size={28}>
                  <path d="m12 3-8 4 8 4 8-4-8-4Z" />
                  <path d="m4 12 8 4 8-4" />
                  <path d="m4 17 8 4 8-4" />
                </Icon>
              </div>

              <div>
                <span>Total Material</span>
                <strong>{totalMaterial}</strong>
                <small>Material</small>
              </div>
            </div>

            <div className="stock-summary-card safe">
              <div className="stock-summary-icon">
                <StatusIcon status="Aman" />
              </div>

              <div>
                <span>Stok Aman</span>
                <strong>{aman}</strong>
                <small>Material</small>
              </div>
            </div>

            <div className="stock-summary-card warning">
              <div className="stock-summary-icon">
                <StatusIcon status="Rendah" />
              </div>

              <div>
                <span>Stok Menipis</span>
                <strong>{rendah}</strong>
                <small>Material</small>
              </div>
            </div>

            <div className="stock-summary-card danger">
              <div className="stock-summary-icon">
                <StatusIcon status="Kosong" />
              </div>

              <div>
                <span>Stok Habis</span>
                <strong>{habis}</strong>
                <small>Material</small>
              </div>
            </div>
          </section>

          {/* TABLE */}
          <section className="stock-table-card">
            <div className="stock-table-toolbar">
              <div>
                <h2>Daftar Kondisi Stok Material</h2>
                <p>
                  Status material diperbarui berdasarkan
                  stok saat ini dan batas minimum.
                </p>
              </div>

              <div className="stock-filter">
                <Icon size={19}>
                  <path d="M4 6h16M7 12h10M10 18h4" />
                </Icon>

                <select
                  value={filter}
                  onChange={(e) =>
                    setFilter(e.target.value)
                  }
                >
                  <option>Semua Status</option>
                  <option value="Aman">Stok Aman</option>
                  <option value="Rendah">
                    Stok Menipis
                  </option>
                  <option value="Kosong">
                    Stok Habis
                  </option>
                </select>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="stock-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Material</th>
                    <th>Stok Saat Ini</th>
                    <th>Minimum</th>
                    <th>Selisih</th>
                    <th>Status</th>
                    <th>Tindakan</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredMaterials.length > 0 ? (
                    filteredMaterials.map(
                      (material) => {
                        const difference =
                          material.stock -
                          material.minimum;

                        return (
                          <tr key={material.id}>
                            <td>{material.id}</td>

                            <td>
                              <div className="stock-material-name">
                                <strong>
                                  {material.name}
                                </strong>
                                <span>
                                  {material.type}
                                </span>
                              </div>
                            </td>

                            <td>
                              <strong>
                                {material.stock}
                              </strong>{" "}
                              {material.unit}
                            </td>

                            <td>
                              {material.minimum}{" "}
                              {material.unit}
                            </td>

                            <td>
                              <span
                                className={`difference ${
                                  difference > 0
                                    ? "positive"
                                    : difference < 0
                                    ? "negative"
                                    : "zero"
                                }`}
                              >
                                {difference > 0
                                  ? `+${difference}`
                                  : difference}
                              </span>
                            </td>

                            <td>
                              <div
                                className={`stock-status-badge ${material.status.toLowerCase()}`}
                              >
                                <StatusIcon
                                  status={material.status}
                                />

                                {getStatusText(
                                  material.status
                                )}
                              </div>
                            </td>

                            <td>
                              {material.status !==
                                "Aman" && (
                                <Link
                                  href={`/pengadaan?material=${material.id}`}
                                  className="procurement-link"
                                >
                                  Ajukan Pengadaan
                                </Link>
                              )}

                              {material.status ===
                                "Aman" && (
                                <span className="no-action">
                                  —
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      }
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="empty-stock-row"
                      >
                        Tidak ada material yang sesuai.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* INFO */}
            <div className="stock-info-box">
              <div className="stock-info-icon">
                <Icon size={20}>
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                  />
                  <path d="M12 11v5M12 8v.5" />
                </Icon>
              </div>

              <div>
                <strong>
                  Informasi Status Stok
                </strong>

                <p>
                  <b>Aman</b> berarti stok berada di
                  atas batas minimum.{" "}
                  <b>Menipis</b> berarti stok berada
                  pada atau di bawah batas minimum.{" "}
                  <b>Habis</b> berarti stok bernilai
                  nol.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}