import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api/client.js";

export default function Movies() {
  const [sp, setSp] = useSearchParams();
  const page = Number(sp.get("page") || "1");

  const [search, setSearch] = useState(sp.get("search") || "");
  const [genre, setGenre] = useState(sp.get("genre") || "");
  const [year, setYear] = useState(sp.get("year") || "");
  const [minRating, setMinRating] = useState(sp.get("minRating") || "");

  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const q = new URLSearchParams();
      q.set("page", String(page));
      q.set("limit", "12");
      if (search) q.set("search", search);
      if (genre) q.set("genre", genre);
      if (year) q.set("year", year);
      if (minRating) q.set("minRating", minRating);

      const res = await api(`/movies?${q.toString()}`);
      setData(res);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [sp]);

  const applyFilters = () => {
    const q = {};
    if (search) q.search = search;
    if (genre) q.genre = genre;
    if (year) q.year = year;
    if (minRating) q.minRating = minRating;
    q.page = 1;
    setSp(q);
  };

  const goPage = (p) => {
    const q = Object.fromEntries(sp.entries());
    q.page = p;
    setSp(q);
  };

  return (
    <div className="container page-minh">
      <h2>Movies</h2>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Search & Filters</h3>

        <div className="row" style={{ alignItems: "flex-end" }}>
          <div style={{ flex: 2, minWidth: 300 }}>
            <label>Search</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title..."
            />
          </div>

          <div style={{ flex: 1, minWidth: 220 }}>
            <label>Genre</label>
            <input
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Action / Drama..."
            />
          </div>

          <div style={{ flex: 1, minWidth: 180 }}>
            <label>Year</label>
            <input
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2010"
            />
          </div>

          <div style={{ flex: 1, minWidth: 220 }}>
            <label>Min Rating</label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>

        <div className="row" style={{ marginTop: 18 }}>
          <button onClick={applyFilters}>Apply</button>
          <button
            className="secondary"
            onClick={() => {
              setSearch("");
              setGenre("");
              setYear("");
              setMinRating("");
              setSp({ page: 1 });
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div style={{ height: 18 }} />

      {loading ? (
        <p>Loading...</p>
      ) : err ? (
        <p>{err}</p>
      ) : !data || data.movies.length === 0 ? (
        <p>No movies found</p>
      ) : (
        <>
          <div className="grid">
            {data.movies.map((m) => (
              <Link to={`/movies/${m._id}`} key={m._id} className="card">
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

          <div
            className="row"
            style={{ marginTop: 22, justifyContent: "center" }}
          >
            <button
              className="secondary"
              disabled={page <= 1}
              onClick={() => goPage(page - 1)}
            >
              Prev
            </button>
            <span className="badge">
              Page {data.page} / {data.totalPages || 1}
            </span>
            <button
              className="secondary"
              disabled={page >= (data.totalPages || 1)}
              onClick={() => goPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
