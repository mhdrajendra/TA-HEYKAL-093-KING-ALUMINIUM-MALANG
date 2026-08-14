"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  getTransactions,
  type Transaction,
  type TransactionType,
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

function TypeIcon({
  type,
}: {
  type: TransactionType;
}) {
  if (type === "Material Masuk") {
    return (
      <Icon size={19}>
        <path d="M12 4v12" />
        <path d="m7 11 5 5 5-5" />
      </Icon>
    );
  }

  if (type === "Material Keluar") {
    return (
      <Icon size={19}>
        <path d="M12 20V8" />
        <path d="m7 13 5-5 5 5" />
      </Icon>
    );
  }

  if (type === "Pengadaan Disetujui") {
    return (
      <Icon size={19}>
        <path d="m5 12 4 4L19 6" />
      </Icon>
    );
  }

  if (type === "Pengadaan Ditolak") {
    return (
      <Icon size={19}>
        <path d="M6 6l12 12M18 6 6 18" />
      </Icon>
    );
  }

  return (
    <Icon size={19}>
      <path d="M3 7h11v10H3z" />
      <path d="M14 10h4l3 3v4h-7z" />
      <circle cx="7" cy="19" r="2" />
      <circle cx="18" cy="19" r="2" />
    </Icon>
  );
}

function TypeBadge({
  type,
}: {
  type: TransactionType;
}) {
  const className =
    type === "Material Masuk"
      ? "masuk"
      : type === "Material Keluar"
      ? "keluar"
      : type.includes("Disetujui")
      ? "disetujui"
      : type.includes("Ditolak")
      ? "ditolak"
      : "pengadaan";

  return (
    <span
      className={`transaction-type-badge ${className}`}
    >
      <TypeIcon type={type} />

      {type}
    </span>
  );
}

export default function RiwayatTransaksiPage() {
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] =
    useState("Semua Transaksi");

  useEffect(() => {
    setTransactions(getTransactions());
  }, []);

  const filteredTransactions =
    transactions.filter((transaction) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        transaction.id
          .toLowerCase()
          .includes(keyword) ||
        transaction.materialName
          .toLowerCase()
          .includes(keyword) ||
        transaction.user
          .toLowerCase()
          .includes(keyword);

      const matchesFilter =
        filter === "Semua Transaksi" ||
        transaction.type === filter;

      return matchesSearch && matchesFilter;
    });

  const total = transactions.length;

  const masuk = transactions.filter(
    (item) =>
      item.type === "Material Masuk"
  ).length;

  const keluar = transactions.filter(
    (item) =>
      item.type === "Material Keluar"
  ).length;

  const pengadaan = transactions.filter(
    (item) =>
      item.type ===
        "Pengadaan Diajukan" ||
      item.type ===
        "Pengadaan Disetujui" ||
      item.type ===
        "Pengadaan Ditolak"
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
              item.name ===
              "Riwayat Transaksi";

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
                    {item.name ===
                      "Dashboard" && (
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

                    {item.name ===
                      "Data Material" && (
                      <>
                        <path d="M4 12a8 8 0 1 0 16 0" />
                        <path d="M8 14l3-3 2 2 4-5" />
                      </>
                    )}

                    {item.name ===
                      "Pengecekan Stok" && (
                      <>
                        <path d="M6 3h8l4 4v14H6z" />
                        <path d="M14 3v5h5" />
                        <circle
                          cx="10"
                          cy="14"
                          r="3"
                        />
                      </>
                    )}

                    {item.name ===
                      "Pengadaan Material" && (
                      <>
                        <path d="M3 7h11v10H3z" />
                        <path d="M14 10h4l3 3v4h-7z" />
                        <circle
                          cx="7"
                          cy="19"
                          r="2"
                        />
                        <circle
                          cx="18"
                          cy="19"
                          r="2"
                        />
                      </>
                    )}

                    {item.name ===
                      "Persetujuan Pengadaan" && (
                      <>
                        <path d="M12 3 4 7l8 4 8-4-8-4Z" />
                        <path d="m4 12 8 4 8-4" />
                        <path d="m4 17 8 4 8-4" />
                      </>
                    )}

                    {item.name ===
                      "Riwayat Transaksi" && (
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
                  <circle
                    cx="12"
                    cy="8"
                    r="3.5"
                  />
                  <path d="M5 20c.7-3.5 3.1-5 7-5s6.3 1.5 7 5" />
                </Icon>
              </div>

              <span>Admin</span>
            </div>
          </div>
        </header>

        <main className="page-content">
          <div className="history-heading">
            <div>
              <h1>Riwayat Transaksi</h1>

              <p>
                Lihat seluruh aktivitas transaksi
                material dan pengadaan.
              </p>
            </div>

            <button
              className="refresh-button"
              onClick={() =>
                setTransactions(
                  getTransactions()
                )
              }
            >
              Refresh
            </button>
          </div>

          {/* SUMMARY */}
          <section className="history-summary-grid">
            <div className="history-summary total">
              <strong>{total}</strong>
              <span>Total Transaksi</span>
            </div>

            <div className="history-summary masuk">
              <strong>{masuk}</strong>
              <span>Material Masuk</span>
            </div>

            <div className="history-summary keluar">
              <strong>{keluar}</strong>
              <span>Material Keluar</span>
            </div>

            <div className="history-summary pengadaan">
              <strong>{pengadaan}</strong>
              <span>Aktivitas Pengadaan</span>
            </div>
          </section>

          {/* TABLE */}
          <section className="history-table-card">
            <div className="history-toolbar">
              <div className="history-search">
                <Icon size={20}>
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </Icon>

                <input
                  placeholder="Cari transaksi..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />
              </div>

              <select
                className="history-filter"
                value={filter}
                onChange={(e) =>
                  setFilter(
                    e.target.value
                  )
                }
              >
                <option>
                  Semua Transaksi
                </option>

                <option>
                  Material Masuk
                </option>

                <option>
                  Material Keluar
                </option>

                <option>
                  Pengadaan Diajukan
                </option>

                <option>
                  Pengadaan Disetujui
                </option>

                <option>
                  Pengadaan Ditolak
                </option>
              </select>
            </div>

            <div className="table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>ID Transaksi</th>
                    <th>Tanggal</th>
                    <th>Jenis Transaksi</th>
                    <th>Material</th>
                    <th>Jumlah</th>
                    <th>Keterangan</th>
                    <th>Pengguna</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTransactions.length >
                  0 ? (
                    filteredTransactions.map(
                      (transaction) => (
                        <tr
                          key={
                            transaction.id
                          }
                        >
                          <td>
                            <strong>
                              {
                                transaction.id
                              }
                            </strong>
                          </td>

                          <td>
                            <div className="history-date">
                              <span>
                                {new Date(
                                  transaction.date
                                ).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "2-digit",
                                    month:
                                      "short",
                                    year:
                                      "numeric",
                                  }
                                )}
                              </span>

                              <small>
                                {
                                  transaction.time
                                }
                              </small>
                            </div>
                          </td>

                          <td>
                            <TypeBadge
                              type={
                                transaction.type
                              }
                            />
                          </td>

                          <td>
                            <div className="history-material">
                              <strong>
                                {
                                  transaction.materialName
                                }
                              </strong>

                              <span>
                                ID:{" "}
                                {
                                  transaction.materialId
                                }
                              </span>
                            </div>
                          </td>

                          <td>
                            {transaction.quantity}{" "}
                            {transaction.unit}
                          </td>

                          <td>
                            <span className="history-description">
                              {
                                transaction.description
                              }
                            </span>
                          </td>

                          <td>
                            {
                              transaction.user
                            }
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="empty-history"
                      >
                        Tidak ada transaksi yang
                        ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="history-footer">
              Menampilkan{" "}
              {
                filteredTransactions.length
              }{" "}
              dari {transactions.length}{" "}
              transaksi
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}