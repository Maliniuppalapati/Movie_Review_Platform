import React from "react";

export default function StarRating({ value, onChange }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="row" style={{ gap: 6 }}>
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          className={s <= value ? "" : "secondary"}
          onClick={() => onChange?.(s)}
          style={{ padding: "6px 10px" }}
        >
          {s}★
        </button>
      ))}
    </div>
  );
}
