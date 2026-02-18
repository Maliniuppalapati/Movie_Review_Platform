import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {

    e.preventDefault();

    setErr("");
    setLoading(true);

    try {

      const data = await api("/auth/login", {
        method: "POST",
        body: { email, password }
      });

      login(data);

      nav("/movies", { replace: true });

    } catch (e2) {

      setErr(e2.message || "Login failed");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="container page-center">

      <div className="card login-card">

        <h2>Login</h2>

        <form onSubmit={submit}>

          <label>Email</label>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div style={{ height: 12 }} />

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div style={{ height: 16 }} />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {err && <p className="badge">{err}</p>}

        <div style={{ marginTop: 14 }}>

          <small>
            Don’t have account? <Link to="/register">Register</Link>
          </small>

        </div>

      </div>

    </div>

  );

}
