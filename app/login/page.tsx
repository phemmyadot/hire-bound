"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { COLORS } from "@/lib/constants";
import { AppLogo } from "@/components/layout/AppLogo";

const inputStyle: React.CSSProperties = {
  padding: "9px 12px",
  background: COLORS.bg,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 6,
  color: COLORS.text,
  fontSize: "14px",
  outline: "none",
  fontFamily: "inherit",
  width: "100%",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [mode, setMode]         = useState<"login" | "register">("login");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        const res = await fetch(`${apiUrl}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.detail ?? "Registration failed");
          return;
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: COLORS.bg,
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 360,
          padding: "32px",
          background: COLORS.surface,
          borderRadius: 10,
          border: `1px solid ${COLORS.border}`,
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: "24px" }}>
          <AppLogo />
        </div>

        {/* Heading */}
        <div style={{ marginBottom: "24px" }}>
          <h1
            style={{
              margin: "0 0 4px",
              fontSize: "16px",
              fontWeight: 600,
              color: COLORS.text,
              letterSpacing: "-0.3px",
            }}
          >
            {mode === "login" ? "Sign in" : "Create account"}
          </h1>
          <p style={{ margin: 0, fontSize: "13px", color: COLORS.textDim }}>
            {mode === "login"
              ? "Enter your credentials to continue."
              : "Set up your HireBound account."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              style={{ fontSize: "12px", fontWeight: 500, color: COLORS.textMuted }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={inputStyle}
              onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = COLORS.borderMid; }}
              onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = COLORS.border; }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              style={{ fontSize: "12px", fontWeight: 500, color: COLORS.textMuted }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              style={inputStyle}
              onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = COLORS.borderMid; }}
              onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = COLORS.border; }}
            />
          </div>

          {error && (
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: COLORS.redDim,
                padding: "8px 12px",
                background: COLORS.redBg,
                border: `1px solid ${COLORS.redBorder}`,
                borderRadius: 6,
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px",
              background: loading ? COLORS.surfaceAlt : COLORS.blue,
              color: loading ? COLORS.textFaint : "#fff",
              border: "none",
              borderRadius: 6,
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "2px",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!loading) (e.currentTarget as HTMLButtonElement).style.opacity = "0.85";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "1";
            }}
          >
            {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p
          style={{
            marginTop: "20px",
            textAlign: "center",
            fontSize: "12px",
            color: COLORS.textDim,
          }}
        >
          {mode === "login" ? "No account? " : "Already have one? "}
          <button
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            style={{
              background: "none",
              border: "none",
              color: COLORS.blue,
              cursor: "pointer",
              fontSize: "12px",
              fontFamily: "inherit",
              padding: 0,
            }}
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
