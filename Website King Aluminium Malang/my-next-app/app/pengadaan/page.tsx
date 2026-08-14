"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  getMaterials,
  type Material,
} from "@/lib/materials";
import {
  getProcurements,
  type Procurement,
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

function StatusBadge({
  status,
}: {
  status: Procurement["status"];
}) {
  const className = status.toLowerCase();

  return (
    <span className={`procurement-status ${className}`}>
      <span className="status-dot" />
      {status}
    </span>
  );
}

export default function PengadaanPage() {
  const searchParams = useSearchParams();

  const [materials, setMaterials] = useState<Material[]>([]);
  const [procurements, setProcurements] = useState<
    Procurement[]
  >([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua Status");

  useEffect(() => {
    setMaterials(getMaterials());
    setProcurements(getProcurements());
  }, []);

  const selectedMaterialId =
    searchParams.get("material") || "";

  const selectedMaterial = useMemo(
    () =>
      materials.find(
        (material) => material.id === selectedMaterialId
      ),
    [materials, selectedMaterialId]
  );

  const filteredProcurements = procurements.filter(
    (procurement) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        procurement.id
          .toLowerCase()
          .includes(keyword) ||
        procurement.materialName
          .toLowerCase()
          .includes(keyword) ||
        procurement.supplier
          .toLowerCase()
          .includes(keyword);

      const matchesStatus =
        filter === "Semua Status" ||
        procurement.status === filter;

      return matchesSearch && matchesStatus;
    }
  );

  const total = procurements.length;
  const pending = procurements.filter(
    (item) => item.status === "Menunggu"
  ).length;
  const approved = procurements.filter(
    (item) => item.status === "Disetujui"
  ).length;
  const rejected = procurements.filter(
    (item) => item.status === "Ditolak"
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

                  {item.name ===
                    "Pengadaan Material" && (
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

        <main className="page-content">
          {/* HEADER */}
          <div className="procurement-heading">
            <div>
              <h1>Pengadaan Material</h1>

              <p>
                Kelola pengadaan material dan pantau
                status pengajuan.
              </p>
            </div>

            <Link
              href={
                selectedMaterialId
                  ? `/pengadaan/ajukan?material=${selectedMaterialId}`
                  : "/pengadaan/ajukan"
              }
              className="primary-action"
            >
              <Icon size={21}>
                <path d="M12 5v14M5 12h14" />
              </Icon>

              Ajukan Pengadaan
            </Link>
          </div>

          {/* OPTIONAL SELECTED MATERIAL */}
          {selectedMaterial && (
            <div className="selected-material-banner">
              <div className="selected-material-icon">
                <Icon size={23}>
                  <path d="m12 3-8 4 8 4 8-4-8-4Z" />
                  <path d="m4 12 8 4 8-4" />
                </Icon>
              </div>

              <div>
                <strong>
                  Pengadaan untuk {selectedMaterial.name}
                </strong>

                <span>
                  Stok saat ini:{" "}
                  {selectedMaterial.stock}{" "}
                  {selectedMaterial.unit} — Minimum:{" "}
                  {selectedMaterial.minimum}{" "}
                  {selectedMaterial.unit}
                </span>
              </div>
            </div>
          )}

          {/* SUMMARY */}
          <section className="procurement-summary-grid">
            <div className="procurement-summary-card total">
              <div className="procurement-summary-icon">
                <Icon size={27}>
                  <path d="M4 7h16v13H4z" />
                  <path d="M8 7V5h8v2" />
                </Icon>
              </div>

              <div>
                <span>Total Pengadaan</span>
                <strong>{total}</strong>
                <small>Pengajuan</small>
              </div>
            </div>

            <div className="procurement-summary-card pending">
              <div className="procurement-summary-icon">
                <Icon size={27}>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </Icon>
              </div>

              <div>
                <span>Menunggu</span>
                <strong>{pending}</strong>
                <small>Pengajuan</small>
              </div>
            </div>

            <div className="procurement-summary-card approved">
              <div className="procurement-summary-icon">
                <Icon size={27}>
                  <circle cx="12" cy="12" r="9" />
                  <path d="m8 12 3 3 5-6" />
                </Icon>
              </div>

              <div>
                <span>Disetujui</span>
                <strong>{approved}</strong>
                <small>Pengajuan</small>
              </div>
            </div>

            <div className="procurement-summary-card rejected">
              <div className="procurement-summary-icon">
                <Icon size={27}>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M8 8l8 8M16 8l-8 8" />
                </Icon>
              </div>

              <div>
                <span>Ditolak</span>
                <strong>{rejected}</strong>
                <small>Pengajuan</small>
              </div>
            </div>
          </section>

          {/* TABLE */}
          <section className="procurement-table-card">
            <div className="procurement-toolbar">
              <div className="procurement-search">
                <Icon size={20}>
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </Icon>

                <input
                  placeholder="Cari pengadaan..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />
              </div>

              <div className="procurement-filter">
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
                  <option value="Menunggu">
                    Menunggu
                  </option>
                  <option value="Disetujui">
                    Disetujui
                  </option>
                  <option value="Ditolak">
                    Ditolak
                  </option>
                  <option value="Diproses">
                    Diproses
                  </option>
                  <option value="Selesai">
                    Selesai
                  </option>
                </select>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="procurement-table">
                <thead>
                  <tr>
                    <th>ID Pengadaan</th>
                    <th>Tanggal</th>
                    <th>Material</th>
                    <th>Jumlah</th>
                    <th>Supplier</th>
                    <th>Pemohon</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProcurements.length > 0 ? (
                    filteredProcurements.map(
                      (procurement) => (
                        <tr key={procurement.id}>
                          <td>
                            <strong>
                              {procurement.id}
                            </strong>
                          </td>

                          <td>
                            {new Date(
                              procurement.date
                            ).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </td>

                          <td>
                            <div className="procurement-material">
                              <strong>
                                {
                                  procurement.materialName
                                }
                              </strong>

                              <span>
                                {
                                  procurement.note
                                }
                              </span>
                            </div>
                          </td>

                          <td>
                            {procurement.quantity}{" "}
                            {procurement.unit}
                          </td>

                          <td>
                            {procurement.supplier}
                          </td>

                          <td>
                            {procurement.requester}
                          </td>

                          <td>
                            <StatusBadge
                              status={
                                procurement.status
                              }
                            />
                          </td>

                          <td>
                            <Link
                              href={`/persetujuan-pengadaan?id=${procurement.id}`}
                              className="detail-link"
                            >
                              Detail
                            </Link>
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="empty-procurement"
                      >
                        Tidak ada data pengadaan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="procurement-footer">
              Menampilkan {filteredProcurements.length}{" "}
              dari {procurements.length} pengajuan
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}