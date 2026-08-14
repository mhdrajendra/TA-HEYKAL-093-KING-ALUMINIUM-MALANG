"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (username && password) {
      router.push("/dashboard");
    }
  };

  return (
    <main className="login-page">
      <div className="login-container">

        <div className="brand">
          <div className="logo-box">
            <span className="logo-k">K</span>
            <span className="logo-triangle"></span>
          </div>

          <div className="brand-text">
            <h1>KING ALUMINIUM MALANG</h1>
            <p>Sistem Pengecekan Stok Material</p>
          </div>
        </div>

        <form className="login-card" onSubmit={handleLogin}>

          <div className="form-group">
            <label htmlFor="username">Username</label>

            <div className="input-wrapper">
              <svg
                className="input-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5Zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5Z" />
              </svg>

              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group password-group">
            <label htmlFor="password">Password</label>

            <div className="input-wrapper">
              <svg
                className="input-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="4" y="10" width="16" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                <circle cx="12" cy="15.5" r="1" fill="currentColor" />
              </svg>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="login-button">
            LOGIN
          </button>

        </form>
      </div>
    </main>
  );
}