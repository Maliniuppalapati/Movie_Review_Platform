import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import StarRating from "../components/StarRating.jsx";

export default function MovieDetails() {
  const { id } = useParams();
  const { user, token } = useAuth();

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [watchlistIds, setWatchlistIds] = useState(new Set());

  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    setMsg("");
    try {
      const res = await api(`/movies/${id}`);
      setMovie(res.movie);
      setReviews(res.reviews || []);

      if (user) {
        const w = await api(`/users/${user.id}/watchlist`, { token });
        setWatchlistIds(new Set((w.watchlist || []).map((m) => m._id)));
      }
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id, user?.id]);

  const inWatchlist = user ? watchlistIds.has(id) : false;

  const toggleWatchlist = async () => {
    if (!user) return;
    setMsg("");
    setErr("");
    try {
      if (inWatchlist) {
        const res = await api(`/users/${user.id}/watchlist/${id}`, {
          method: "DELETE",
          token,
        });
        setWatchlistIds(new Set((res.watchlist || []).map((m) => m._id)));
        setMsg("Removed from watchlist");
      } else {
        const res = await api(`/users/${user.id}/watchlist`, {
          method: "POST",
          token,
          body: { movieId: id },
        });
        setWatchlistIds(new Set((res.watchlist || []).map((m) => m._id)));
        setMsg("Added to watchlist");
      }
    } catch (e) {
      setErr(e.message);
    }
  };

  const submitReview = async () => {
    setErr("");
    setMsg("");
    try {
      const res = await api(`/movies/${id}/reviews`, {
        method: "POST",
        token,
        body: { rating, reviewText },
      });

      setReviews((prev) => [res.review, ...prev]);
      setMovie((m) => ({ ...m, averageRating: res.averageRating }));
      setReviewText("");
      setMsg("Review submitted");
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

  if (!movie)
    return (
      <div className="container page-minh">
        <p>Movie not found</p>
      </div>
    );

  return (
    <div className="container page-minh">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>{movie.title}</h2>

        <div className="row" style={{ marginTop: 8 }}>
          <span className="badge">{movie.genre}</span>
          <span className="badge">{movie.releaseYear}</span>
          <span className="badge">⭐ {movie.averageRating || 0}</span>

          {user && (
            <button className="secondary" onClick={toggleWatchlist}>
              {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            </button>
          )}
        </div>

        <div style={{ height: 12 }} />

        <p>
          <small className="muted">Director:</small> {movie.director || "N/A"}
        </p>
        <p>
          <small className="muted">Cast:</small>{" "}
          {movie.cast?.length ? movie.cast.join(", ") : "N/A"}
        </p>
        <p>{movie.synopsis || "No synopsis"}</p>

        {msg && <p className="badge">{msg}</p>}
      </div>

      <div style={{ height: 16 }} />

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Reviews</h3>

        {!user ? (
          <p>
            <small className="muted">Login to submit a review.</small>
          </p>
        ) : (
          <>
            <div className="row" style={{ alignItems: "flex-start" }}>
              <div style={{ flex: 1, minWidth: 260 }}>
                <label>Rating</label>
                <StarRating value={rating} onChange={setRating} />
              </div>

              <div style={{ flex: 3, minWidth: 320 }}>
                <label>Review</label>
                <textarea
                  rows="3"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your review..."
                />
              </div>
            </div>

            <div className="row" style={{ marginTop: 14 }}>
              <button onClick={submitReview} disabled={!reviewText.trim()}>
                Submit Review
              </button>
              {err && <span className="badge">{err}</span>}
            </div>

            <hr />
          </>
        )}

        {reviews.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          <div className="row" style={{ flexDirection: "column" }}>
            {reviews.map((r) => (
              <div className="card" key={r._id}>
                <div className="row" style={{ alignItems: "center", gap: 14 }}>
                  {r.userId?.profilePicture ? (
                    <img
                      src={r.userId.profilePicture}
                      alt="User"
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 14,
                        objectFit: "cover",
                        border: "1px solid rgba(255,255,255,0.18)",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 14,
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.14)",
                      }}
                    />
                  )}

                  <div style={{ flex: 1 }}>
                    <div
                      className="row"
                      style={{ justifyContent: "space-between" }}
                    >
                      <b>{r.userId?.username || "User"}</b>
                      <span className="badge">{r.rating}★</span>
                    </div>

                    <small className="muted">
                      {new Date(r.createdAt).toLocaleString()}
                    </small>
                  </div>
                </div>

                <p style={{ marginTop: 10, marginBottom: 0 }}>
                  {r.reviewText || "-"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
