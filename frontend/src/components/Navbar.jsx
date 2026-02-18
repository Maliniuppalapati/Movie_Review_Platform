import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { isAuthed, logout } = useAuth();
  const nav = useNavigate();

  return (
    <div className="nav">
      <div>
        <Link to="/">MovieReview</Link>
      </div>

      <div className="links">
        <Link to="/movies">Movies</Link>

        {isAuthed ? (
          <>
            <Link to="/profile">Profile</Link>
            <button
              className="secondary"
              type="button"
              onClick={() => {
                logout();
                nav("/login", { replace: true });
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}
