import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { register, loading } = useAuth();
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const isValidEmail = (v) => /^\S+@\S+\.\S+$/.test(v.trim());

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    const u = username.trim();
    const em = email.trim();

    if (!u) return setErr("Username is required");
    if (u.length < 3) return setErr("Username must be at least 3 characters");
    if (!em) return setErr("Email is required");
    if (!isValidEmail(em)) return setErr("Invalid email");
    if (!password) return setErr("Password is required");
    if (password.length < 6)
      return setErr("Password must be at least 6 characters");

    try {
      await register(u, em, password);
      nav("/movies", { replace: true });
    } catch (e2) {
      setErr(e2.message || "Registration failed");
    }
  };

  return (
    <div className="page-center">
      <div className="card login-card">
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Register</h2>

        <form onSubmit={submit}>
          <label>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <div style={{ height: 14 }} />

          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />

          <div style={{ height: 14 }} />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div style={{ height: 20 }} />

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {err && (
          <p className="badge" style={{ marginTop: 14 }}>
            {err}
          </p>
        )}

        <small
          className="muted"
          style={{
            display: "block",
            marginTop: 16,
            textAlign: "center",
          }}
        >
          Already have account? <Link to="/login">Login</Link>
        </small>
      </div>
    </div>
  );
}
