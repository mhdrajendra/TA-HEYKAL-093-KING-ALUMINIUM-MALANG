"use client";

import Link from "next/link";
import { useState } from "react";

function Icon({
  children,
  size = 24,
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

function Logo() {
  return (
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
  );
}

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: (
      <Icon>
        <rect x="4" y="7" width="16" height="13" rx="2" />
        <path d="M7 7V5a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v2" />
        <path d="M4 11h16" />
        <path d="M9 14h6" />
      </Icon>
    ),
  },
  {
    name: "Data Material",
    href: "/material",
    icon: (
      <Icon>
        <path d="M4 12a8 8 0 1 0 16 0" />
        <path d="M4 12a8 8 0 0 1 16 0" />
        <path d="M8 14l3-3 2 2 4-5" />
      </Icon>
    ),
  },
  {
    name: "Pengecekan Stok",
    href: "/pengecekan-stok",
    icon: (
      <Icon>
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M14 3v5h5" />
        <circle cx="10" cy="14" r="3" />
        <path d="m12.5 16.5 2 2" />
      </Icon>
    ),
  },
  {
    name: "Pengadaan Material",
    href: "/pengadaan",
    icon: (
      <Icon>
        <path d="M3 7h11v10H3z" />
        <path d="M14 10h4l3 3v4h-7z" />
        <circle cx="7" cy="19" r="2" />
        <circle cx="18" cy="19" r="2" />
      </Icon>
    ),
  },
  {
    name: "Persetujuan Pengadaan",
    href: "/persetujuan-pengadaan",
    icon: (
      <Icon>
        <path d="M12 3 4 7l8 4 8-4-8-4Z" />
        <path d="m4 12 8 4 8-4" />
        <path d="m4 17 8 4 8-4" />
      </Icon>
    ),
  },
  {
    name: "Riwayat Transaksi",
    href: "/riwayat-transaksi",
    icon: (
      <Icon>
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <path d="M9 2v4M15 2v4M8 10h8M8 14h5" />
      </Icon>
    ),
  },
];

export default function DashboardPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <Logo />

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`sidebar-item ${
                item.name === "Dashboard" ? "active" : ""
              }`}
            >
              <span className="sidebar-icon">{item.icon}</span>
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
      <div className="dashboard-main">
        {/* TOPBAR */}
        <header className="topbar">
          <div className="search-box">
            <Icon size={24}>
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </Icon>

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="topbar-right">
            <button className="topbar-icon">
              <Icon size={25}>
                <rect x="3" y="5" width="18" height="14" rx="3" />
                <path d="m4 7 8 6 8-6" />
              </Icon>
            </button>

            <button className="topbar-icon notification">
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

              <Icon size={18}>
                <path d="m6 9 6 6 6-6" />
              </Icon>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="dashboard-content">
          {/* TITLE */}
          <section className="welcome-section">
            <div>
              <h1>Selamat Datang di Sistem Pengecekan Stok Material</h1>
              <p>
                Pantau ringkasan stok material dan aktivitas pengadaan secara
                keseluruhan.
              </p>
            </div>

            <div className="date-button">
              <Icon size={22}>
                <rect x="3" y="4" width="18" height="17" rx="2" />
                <path d="M16 2v4M8 2v4M3 9h18" />
              </Icon>
              <span>Rabu, 29 April 2026</span>
            </div>
          </section>

          {/* SUMMARY CARDS */}
          <section className="summary-grid">
            <SummaryCard
              type="blue"
              title="Total Material"
              value="26"
              unit="Jenis"
              link="Lihat semua material"
              icon={
                <Icon size={31}>
                  <path d="m12 3-8 4 8 4 8-4-8-4Z" />
                  <path d="m4 12 8 4 8-4" />
                  <path d="m4 17 8 4 8-4" />
                </Icon>
              }
            />

            <SummaryCard
              type="green"
              title="Total Stok"
              value="5.480"
              unit="Satuan"
              link="Lihat detail stok"
              icon={
                <Icon size={31}>
                  <path d="M5 7h9l4 4v9H5z" />
                  <path d="M14 7v4h4" />
                  <circle cx="10" cy="14" r="2" />
                </Icon>
              }
            />

            <SummaryCard
              type="orange"
              title="Stok Menipis"
              value="5"
              unit="Material"
              link="Lihat detail"
              icon={
                <Icon size={31}>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v6M12 16v1" />
                </Icon>
              }
            />

            <SummaryCard
              type="red"
              title="Stok Habis"
              value="3"
              unit="Material"
              link="Lihat detail"
              icon={
                <Icon size={31}>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M8 12h8" />
                </Icon>
              }
            />
          </section>

          {/* CHART SECTION */}
          <section className="chart-grid">
            {/* DONUT */}
            <div className="panel stock-panel">
              <h2>Ringkasan Stok Material</h2>

              <div className="stock-chart-area">
                <div className="donut-chart">
                  <div className="donut-center">
                    <span>Total</span>
                    <strong>26</strong>
                    <span>Material</span>
                  </div>
                </div>

                <div className="stock-legend">
                  <LegendItem
                    color="safe"
                    title="Stok Aman"
                    value="18 Material"
                    percent="(69%)"
                  />

                  <LegendItem
                    color="warning"
                    title="Stok Menipis"
                    value="5 Material"
                    percent="(19%)"
                  />

                  <LegendItem
                    color="danger"
                    title="Stok Habis"
                    value="3 Material"
                    percent="(12%)"
                  />
                </div>
              </div>

              <div className="info-note">
                <Icon size={19}>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 11v5M12 8v.5" />
                </Icon>
                <span>
                  Pastikan material dengan stok menipis atau habis segera
                  diajukan pengadaannya.
                </span>
              </div>
            </div>

            {/* LINE CHART */}
            <div className="panel usage-panel">
              <div className="panel-heading">
                <h2>Grafik Penggunaan Material (7 Hari Terakhir)</h2>

                <button className="period-button">
                  7 Hari Terakhir
                  <Icon size={16}>
                    <path d="m5 7 7 7 7-7" />
                  </Icon>
                </button>
              </div>

              <div className="line-chart">
                <div className="y-axis">
                  <span>1000</span>
                  <span>800</span>
                  <span>600</span>
                  <span>400</span>
                  <span>200</span>
                  <span>0</span>
                </div>

                <div className="chart-area">
                  <div className="grid-line line-1" />
                  <div className="grid-line line-2" />
                  <div className="grid-line line-3" />
                  <div className="grid-line line-4" />
                  <div className="grid-line line-5" />
                  <div className="grid-line line-6" />

                  <svg
                    className="usage-svg"
                    viewBox="0 0 650 220"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M35 110 L130 125 L225 100 L320 52 L415 83 L510 110 L605 132 L605 180 L35 180 Z"
                      fill="rgba(60, 145, 165, 0.10)"
                      stroke="none"
                    />

                    <path
                      d="M35 110 L130 125 L225 100 L320 52 L415 83 L510 110 L605 132"
                      fill="none"
                      stroke="#087f98"
                      strokeWidth="2.5"
                    />

                    {[
                      [35, 110, "620"],
                      [130, 125, "530"],
                      [225, 100, "680"],
                      [320, 52, "910"],
                      [415, 83, "740"],
                      [510, 110, "620"],
                      [605, 132, "480"],
                    ].map(([x, y, value]) => (
                      <g key={`${x}-${y}`}>
                        <line
                          x1={x}
                          y1={y}
                          x2={x}
                          y2="180"
                          stroke="#b9c4c8"
                          strokeDasharray="2 4"
                        />
                        <circle
                          cx={x}
                          cy={y}
                          r="5"
                          fill="#087f98"
                        />
                        <text
                          x={x}
                          y={Number(y) - 12}
                          textAnchor="middle"
                          fontSize="13"
                          fontWeight="600"
                          fill="#4d5360"
                        >
                          {value}
                        </text>
                      </g>
                    ))}
                  </svg>

                  <div className="x-axis">
                    <span>23 Apr</span>
                    <span>24 Apr</span>
                    <span>25 Apr</span>
                    <span>26 Apr</span>
                    <span>27 Apr</span>
                    <span>28 Apr</span>
                    <span>29 Apr</span>
                  </div>
                </div>
              </div>

              <div className="usage-summary">
                <div className="usage-summary-icon">
                  <Icon size={27}>
                    <path d="m4 16 6-6 4 3 6-8" />
                    <path d="M15 5h5v5" />
                  </Icon>
                </div>

                <div>
                  <span>Total Penggunaan</span>
                  <strong>
                    4.580 <small>Satuan</small>
                  </strong>
                </div>

                <div className="usage-comparison">
                  <strong>↓ 12%</strong>
                  <span>Dibanding 7 hari sebelumnya</span>
                </div>
              </div>
            </div>
          </section>

          {/* BOTTOM CARDS */}
          <section className="bottom-grid">
            {/* STOCK LOW */}
            <MaterialList
              title="Material Stok Menipis"
              type="warning"
              items={[
                ["Aluminium Plate", "Stok saat ini 10 Lembar", "10 / 20"],
                ["Aluminium Pipa", "Stok saat ini 5 Batang", "5 / 20"],
                ["Aluminium Siku", "Stok saat ini 8 Batang", "8 / 20"],
              ]}
            />

            {/* STOCK EMPTY */}
            <MaterialList
              title="Material Stok Habis"
              type="danger"
              items={[
                ["Aluminium Batang", "Stok saat ini 0 Batang", "0 / 20"],
                ["Paku Rivet", "Stok saat ini 0 Pcs", "0 / 50"],
                ["Sealant Silicone", "Stok saat ini 0 Tube", "0 / 10"],
              ]}
            />

            {/* ACTIVITY */}
            <div className="panel activity-panel">
              <div className="list-header">
                <h2>Aktivitas Terbaru</h2>
                <Link href="/riwayat-transaksi">Lihat Semua</Link>
              </div>

              <div className="activity-list">
                <Activity
                  type="in"
                  title="Material Masuk"
                  description="Aluminium Hollow - 50 Batang"
                  date="29 Apr 2026"
                  time="10:30"
                />

                <Activity
                  type="out"
                  title="Material Keluar"
                  description="Aluminium Plate - 30 Lembar"
                  date="29 Apr 2026"
                  time="09:15"
                />

                <Activity
                  type="procurement"
                  title="Pengadaan Diajukan"
                  description="Aluminium Pipa - 100 Batang"
                  date="28 Apr 2026"
                  time="16:40"
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function SummaryCard({
  type,
  title,
  value,
  unit,
  link,
  icon,
}: {
  type: "blue" | "green" | "orange" | "red";
  title: string;
  value: string;
  unit: string;
  link: string;
  icon: React.ReactNode;
}) {
  return (
    <div className={`summary-card ${type}`}>
      <div className="summary-top">
        <div className="summary-icon">{icon}</div>

        <div className="summary-data">
          <span>{title}</span>
          <strong>{value}</strong>
          <small>{unit}</small>
        </div>
      </div>

      <div className="summary-divider" />

      <Link href="#">{link} &gt;</Link>
    </div>
  );
}

function LegendItem({
  color,
  title,
  value,
  percent,
}: {
  color: string;
  title: string;
  value: string;
  percent: string;
}) {
  return (
    <div className="legend-item">
      <span className={`legend-dot ${color}`} />

      <div>
        <strong>{title}</strong>
        <span>
          {value} <small>{percent}</small>
        </span>
      </div>
    </div>
  );
}

function MaterialList({
  title,
  type,
  items,
}: {
  title: string;
  type: "warning" | "danger";
  items: string[][];
}) {
  return (
    <div className="panel material-panel">
      <div className="list-header">
        <h2>{title}</h2>
        <Link href="/material">Lihat Semua</Link>
      </div>

      <div className="material-list">
        {items.map((item) => (
          <div className="material-row" key={item[0]}>
            <div className={`material-status ${type}`}>
              <Icon size={18}>
                {type === "warning" ? (
                  <>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v6M12 16v1" />
                  </>
                ) : (
                  <>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M8 12h8" />
                  </>
                )}
              </Icon>
            </div>

            <div className="material-info">
              <strong>{item[0]}</strong>
              <span>{item[1]}</span>
            </div>

            <div className={`stock-value ${type}`}>
              <strong>{item[2]}</strong>
              <span>(Min. Stok)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Activity({
  type,
  title,
  description,
  date,
  time,
}: {
  type: "in" | "out" | "procurement";
  title: string;
  description: string;
  date: string;
  time: string;
}) {
  return (
    <div className="activity-row">
      <div className={`activity-icon ${type}`}>
        <Icon size={20}>
          {type === "in" && (
            <>
              <path d="M12 4v12" />
              <path d="m7 11 5 5 5-5" />
              <path d="M5 20h14" />
            </>
          )}

          {type === "out" && (
            <>
              <path d="M12 20V8" />
              <path d="m7 13 5-5 5 5" />
              <path d="M5 4h14" />
            </>
          )}

          {type === "procurement" && (
            <>
              <path d="M3 7h11v10H3z" />
              <path d="M14 10h4l3 3v4h-7z" />
              <circle cx="7" cy="19" r="2" />
              <circle cx="18" cy="19" r="2" />
            </>
          )}
        </Icon>
      </div>

      <div className="activity-description">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      <div className="activity-time">
        <span>{date}</span>
        <span>{time}</span>
      </div>
    </div>
  );
}