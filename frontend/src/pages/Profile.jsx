import React, { useEffect, useState } from "react";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    setMsg("");
    try {
      const res = await api(`/users/${user.id}`, { token });
      setProfile(res.user);
      setReviews(res.reviews || []);
      setWatchlist(res.user.watchlist || []);
      setUsername(res.user.username || "");
      setProfilePicture(res.user.profilePicture || "");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    setErr("");
    setMsg("");
    try {
      const res = await api(`/users/${user.id}`, {
        method: "PUT",
        token,
        body: { username, profilePicture },
      });
      setProfile(res.user);
      setMsg("Profile updated");
    } catch (e) {
      setErr(e.message);
    }
  };

  if (loading)
    return (
      <div className="container page-minh">
        <p>Loading...</p>
      </div>
    );

  if (err)
    return (
      <div className="container page-minh">
        <p>{err}</p>
      </div>
    );

  if (!profile)
    return (
      <div className="container page-minh">
        <p>No profile</p>
      </div>
    );

  return (
    <div className="container page-minh">
      <h2>Profile</h2>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Account</h3>

        <div className="row">
          <div style={{ flex: 1, minWidth: 260 }}>
            <label>Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div style={{ flex: 2, minWidth: 320 }}>
            <label>Profile Picture URL (optional)</label>
            <input
              value={profilePicture}
              onChange={(e) => setProfilePicture(e.target.value)}
            />
          </div>
        </div>

        <div className="row" style={{ marginTop: 14 }}>
          <button onClick={save}>Save</button>
          {msg && <span className="badge">{msg}</span>}
        </div>

        <div style={{ marginTop: 10 }}>
          <small className="muted">Email: {profile.email}</small>
        </div>
      </div>

      <div style={{ height: 18 }} />

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Watchlist</h3>

        {watchlist.length === 0 ? (
          <p>No movies in watchlist</p>
        ) : (
          <div className="grid">
            {watchlist.map((m) => (
              <Link key={m._id} to={`/movies/${m._id}`} className="card">
                <h3 style={{ margin: 0 }}>{m.title}</h3>
                <div className="row" style={{ marginTop: 10 }}>
                  <span className="badge">{m.genre}</span>
                  <span className="badge">{m.releaseYear}</span>
                  <span className="badge">⭐ {m.averageRating || 0}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div style={{ height: 18 }} />

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Your Reviews</h3>

        {reviews.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          <div className="grid">
            {reviews.map((r) => {
              const movieId = r.movieId?._id || r.movieId;
              const movieTitle = r.movieId?.title || "Movie";
              return (
                <div className="card" key={r._id}>
                  <div
                    className="row"
                    style={{ justifyContent: "space-between" }}
                  >
                    {movieId ? (
                      <Link to={`/movies/${movieId}`}>
                        <b>{movieTitle}</b>
                      </Link>
                    ) : (
                      <b>{movieTitle}</b>
                    )}
                    <span className="badge">{r.rating}★</span>
                  </div>

                  <small className="muted">
                    {r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}
                  </small>

                  <div style={{ height: 10 }} />
                  <p style={{ marginBottom: 0 }}>
                    {r.reviewText?.trim() ? r.reviewText : "-"}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
