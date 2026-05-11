import React, { useEffect, useState } from "react";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    releaseYear: 2024,
    director: "",
    synopsis: "",
    posterUrl: ""
  });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }
    loadMovies();
  }, [user]);

  const loadMovies = async () => {
    try {
      const res = await api("/movies?limit=100");
      setMovies(res.movies || []);
    } catch (e) {
      setErr("Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    try {
      await api("/movies", {
        method: "POST",
        token,
        body: {
          ...formData,
          releaseYear: Number(formData.releaseYear)
        }
      });
      setMsg("Movie created successfully!");
      loadMovies();
    } catch (e) {
      setErr(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api(`/movies/${id}`, { method: "DELETE", token });
      setMsg("Movie deleted.");
      loadMovies();
    } catch (e) {
      setErr(e.message);
    }
  };

  if (loading) return <div className="container page-minh"><p>Loading...</p></div>;

  return (
    <div className="container page-minh">
      <h2>Admin Dashboard</h2>
      
      {msg && <p className="badge" style={{ background: "green" }}>{msg}</p>}
      {err && <p className="badge" style={{ background: "red" }}>{err}</p>}

      <div className="card">
        <h3>Add New Movie</h3>
        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          <input placeholder="Genre" value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} required />
          <input type="number" placeholder="Release Year" value={formData.releaseYear} onChange={e => setFormData({...formData, releaseYear: e.target.value})} required />
          <input placeholder="Director" value={formData.director} onChange={e => setFormData({...formData, director: e.target.value})} />
          <input placeholder="Poster URL" value={formData.posterUrl} onChange={e => setFormData({...formData, posterUrl: e.target.value})} />
          <textarea placeholder="Synopsis" value={formData.synopsis} onChange={e => setFormData({...formData, synopsis: e.target.value})} />
          <button type="submit">Create Movie</button>
        </form>
      </div>

      <div style={{ height: 20 }} />

      <div className="card">
        <h3>Manage Movies</h3>
        <table style={{ width: "100%", textAlign: "left" }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Year</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map(m => (
              <tr key={m._id}>
                <td>{m.title}</td>
                <td>{m.releaseYear}</td>
                <td>
                  <button onClick={() => handleDelete(m._id)} style={{ background: "red", padding: "4px 8px" }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
