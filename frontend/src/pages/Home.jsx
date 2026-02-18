import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";

export default function Home() {
  const [top, setTop] = useState([]);
  const [latest, setLatest] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setErr("");
      setLoading(true);
      try {
        const a = await api("/movies?limit=10&page=1");
        const b = await api("/movies?limit=10&page=1&minRating=1");
        setTop(b.movies || []);
        setLatest(a.movies || []);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="container page-minh">
      <h2>Featured Movies</h2>

      {loading ? (
        <p>Loading...</p>
      ) : err ? (
        <p>{err}</p>
      ) : (
        <div className="grid">
          {top.map((m) => (
            <Link key={m._id} to={`/movies/${m._id}`} className="card">
              <h3 style={{ margin: 0 }}>{m.title}</h3>
              <div className="row" style={{ marginTop: 12 }}>
                <span className="badge">{m.genre}</span>
                <span className="badge">{m.releaseYear}</span>
                <span className="badge">⭐ {m.averageRating || 0}</span>
              </div>
              <div style={{ height: 12 }} />
              <small className="muted">
                {(m.synopsis || "").slice(0, 140)}
              </small>
            </Link>
          ))}
        </div>
      )}

      <hr />

      <h2>Trending / Latest</h2>

      {loading ? (
        <p>Loading...</p>
      ) : err ? (
        <p>{err}</p>
      ) : (
        <div className="grid">
          {latest.map((m) => (
            <Link key={m._id} to={`/movies/${m._id}`} className="card">
              <h3 style={{ margin: 0 }}>{m.title}</h3>
              <div className="row" style={{ marginTop: 12 }}>
                <span className="badge">{m.genre}</span>
                <span className="badge">{m.releaseYear}</span>
                <span className="badge">⭐ {m.averageRating || 0}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
