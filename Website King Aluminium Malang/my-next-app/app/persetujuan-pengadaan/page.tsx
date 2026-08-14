"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

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

function StatusBadge({
  status,
}: {
  status: Procurement["status"];
}) {
  return (
    <span
      className={`approval-status ${status.toLowerCase()}`}
    >
      <span className="status-dot" />
      {status}
    </span>
  );
}

export default function PersetujuanPengadaanPage() {
  const searchParams = useSearchParams();

  const [procurements, setProcurements] = useState<
    Procurement[]
  >([]);

  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Menunggu");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadedProcurements = getProcurements();

    setProcurements(loadedProcurements);

    const id = searchParams.get("id");

    if (id) {
      setSelectedId(id);
    } else {
      const firstPending = loadedProcurements.find(
        (item) => item.status === "Menunggu"
      );

      if (firstPending) {
        setSelectedId(firstPending.id);
      }
    }
  }, [searchParams]);

  const selectedProcurement = procurements.find(
    (item) => item.id === selectedId
  );

  const filteredProcurements = procurements.filter(
    (item) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        item.id.toLowerCase().includes(keyword) ||
        item.materialName
          .toLowerCase()
          .includes(keyword) ||
        item.supplier
          .toLowerCase()
          .includes(keyword);

      const matchesFilter =
        filter === "Semua Status" ||
        item.status === filter;

      return matchesSearch && matchesFilter;
    }
  );

  const pendingCount = procurements.filter(
    (item) => item.status === "Menunggu"
  ).length;

  const approvedCount = procurements.filter(
    (item) => item.status === "Disetujui"
  ).length;

  const rejectedCount = procurements.filter(
    (item) => item.status === "Ditolak"
  ).length;

  const handleApproval = (
    action: "approve" | "reject"
  ) => {
    if (!selectedProcurement) {
      return;
    }

    if (selectedProcurement.status !== "Menunggu") {
      setMessage(
        "Pengadaan ini sudah diproses sebelumnya."
      );
      return;
    }

    const newStatus: Procurement["status"] =
      action === "approve"
        ? "Disetujui"
        : "Ditolak";

    const updatedProcurements = procurements.map(
      (procurement) =>
        procurement.id === selectedProcurement.id
          ? {
              ...procurement,
              status: newStatus,
            }
          : procurement
    );

    saveProcurements(updatedProcurements);
    setProcurements(updatedProcurements);

    /* =========================================
       SIMPAN HISTORI PERSETUJUAN / PENOLAKAN
    ========================================= */

    addTransaction({
      id: generateTransactionId(),
      date: new Date()
        .toISOString()
        .split("T")[0],
      time: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type:
        action === "approve"
          ? "Pengadaan Disetujui"
          : "Pengadaan Ditolak",
      materialId:
        selectedProcurement.materialId,
      materialName:
        selectedProcurement.materialName,
      quantity:
        selectedProcurement.quantity,
      unit:
        selectedProcurement.unit,
      description:
        action === "approve"
          ? `Pengadaan ${selectedProcurement.id} disetujui oleh Owner.`
          : `Pengadaan ${selectedProcurement.id} ditolak oleh Owner.`,
      user: "Owner",
    });

    setMessage(
      action === "approve"
        ? `${selectedProcurement.id} berhasil disetujui.`
        : `${selectedProcurement.id} berhasil ditolak.`
    );
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
              item.name === "Persetujuan Pengadaan";

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

              <span>Owner</span>
            </div>
          </div>
        </header>

        <main className="page-content">
          <div className="approval-heading">
            <div>
              <h1>Persetujuan Pengadaan</h1>

              <p>
                Tinjau dan proses pengajuan pengadaan
                material.
              </p>
            </div>
          </div>

          <section className="approval-summary-grid">
            <div className="approval-summary-card pending">
              <div className="approval-summary-icon">
                <Icon size={27}>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </Icon>
              </div>

              <div>
                <span>Menunggu Persetujuan</span>
                <strong>{pendingCount}</strong>
                <small>Pengajuan</small>
              </div>
            </div>

            <div className="approval-summary-card approved">
              <div className="approval-summary-icon">
                <Icon size={27}>
                  <circle cx="12" cy="12" r="9" />
                  <path d="m8 12 3 3 5-6" />
                </Icon>
              </div>

              <div>
                <span>Disetujui</span>
                <strong>{approvedCount}</strong>
                <small>Pengajuan</small>
              </div>
            </div>

            <div className="approval-summary-card rejected">
              <div className="approval-summary-icon">
                <Icon size={27}>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M8 8l8 8M16 8l-8 8" />
                </Icon>
              </div>

              <div>
                <span>Ditolak</span>
                <strong>{rejectedCount}</strong>
                <small>Pengajuan</small>
              </div>
            </div>
          </section>

          <div className="approval-layout">
            <section className="approval-list-card">
              <div className="approval-list-header">
                <div>
                  <h2>Daftar Pengajuan</h2>

                  <span>
                    Pilih pengajuan untuk melihat detail.
                  </span>
                </div>

                <select
                  value={filter}
                  onChange={(e) =>
                    setFilter(e.target.value)
                  }
                >
                  <option value="Menunggu">
                    Menunggu
                  </option>

                  <option value="Semua Status">
                    Semua Status
                  </option>

                  <option value="Disetujui">
                    Disetujui
                  </option>

                  <option value="Ditolak">
                    Ditolak
                  </option>
                </select>
              </div>

              <div className="approval-list">
                {filteredProcurements.length > 0 ? (
                  filteredProcurements.map(
                    (procurement) => (
                      <button
                        type="button"
                        key={procurement.id}
                        className={`approval-list-item ${
                          selectedId ===
                          procurement.id
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedId(
                            procurement.id
                          );
                          setMessage("");
                        }}
                      >
                        <div className="approval-list-icon">
                          <Icon size={22}>
                            <path d="m12 3-8 4 8 4 8-4-8-4Z" />
                            <path d="m4 12 8 4 8-4" />
                          </Icon>
                        </div>

                        <div className="approval-list-content">
                          <strong>
                            {procurement.id}
                          </strong>

                          <span>
                            {
                              procurement.materialName
                            }
                          </span>

                          <small>
                            {procurement.quantity}{" "}
                            {procurement.unit}
                          </small>
                        </div>

                        <StatusBadge
                          status={
                            procurement.status
                          }
                        />
                      </button>
                    )
                  )
                ) : (
                  <div className="approval-empty">
                    Tidak ada pengajuan yang sesuai.
                  </div>
                )}
              </div>
            </section>

            <section className="approval-detail-card">
              {selectedProcurement ? (
                <>
                  <div className="approval-detail-header">
                    <div>
                      <span>ID Pengadaan</span>

                      <strong>
                        {selectedProcurement.id}
                      </strong>
                    </div>

                    <StatusBadge
                      status={selectedProcurement.status}
                    />
                  </div>

                  <div className="approval-detail-grid">
                    <div>
                      <span>Material</span>

                      <strong>
                        {
                          selectedProcurement.materialName
                        }
                      </strong>
                    </div>

                    <div>
                      <span>Jumlah Pengadaan</span>

                      <strong>
                        {selectedProcurement.quantity}{" "}
                        {
                          selectedProcurement.unit
                        }
                      </strong>
                    </div>

                    <div>
                      <span>Tanggal Pengajuan</span>

                      <strong>
                        {new Date(
                          selectedProcurement.date
                        ).toLocaleDateString(
                          "id-ID",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>Supplier</span>

                      <strong>
                        {
                          selectedProcurement.supplier
                        }
                      </strong>
                    </div>

                    <div>
                      <span>Pemohon</span>

                      <strong>
                        {
                          selectedProcurement.requester
                        }
                      </strong>
                    </div>

                    <div>
                      <span>Status</span>

                      <StatusBadge
                        status={
                          selectedProcurement.status
                        }
                      />
                    </div>
                  </div>

                  <div className="approval-note-section">
                    <span>
                      Keterangan Pengajuan
                    </span>

                    <p>
                      {selectedProcurement.note}
                    </p>
                  </div>

                  {selectedProcurement.status ===
                  "Menunggu" ? (
                    <div className="approval-actions">
                      <button
                        type="button"
                        className="approve-button"
                        onClick={() =>
                          handleApproval(
                            "approve"
                          )
                        }
                      >
                        <Icon size={19}>
                          <path d="m5 12 4 4L19 6" />
                        </Icon>

                        Setujui Pengadaan
                      </button>

                      <button
                        type="button"
                        className="reject-button"
                        onClick={() =>
                          handleApproval("reject")
                        }
                      >
                        <Icon size={19}>
                          <path d="M6 6l12 12M18 6 6 18" />
                        </Icon>

                        Tolak Pengadaan
                      </button>
                    </div>
                  ) : (
                    <div className="already-processed">
                      Pengajuan ini sudah diproses dan
                      berstatus{" "}
                      <strong>
                        {selectedProcurement.status}
                      </strong>
                      .
                    </div>
                  )}

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
                </>
              ) : (
                <div className="no-selected-approval">
                  <div className="no-selected-icon">
                    <Icon size={36}>
                      <path d="M4 5h16v14H4z" />
                      <path d="M8 9h8M8 13h5" />
                    </Icon>
                  </div>

                  <h2>
                    Belum Ada Pengajuan Dipilih
                  </h2>

                  <p>
                    Pilih salah satu pengajuan dari
                    daftar untuk melihat detailnya.
                  </p>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}