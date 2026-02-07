import React from "react";

export default function UnderConstruction() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <img
          src="/assets/mic-heading-2-5.png"
          alt="Map in Color logo"
          style={styles.logo}
        />

        <h1 style={styles.title}>New version drops</h1>

        <p style={styles.sub}>
          We’re preparing the next release of Map in Color.
          <br />
          See you very soon.
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "24px",
    background:
      "radial-gradient(1200px 600px at 50% -200px, #f3f6ff 0%, #eef1f7 40%, #e7ebf3 100%)",
  },

  card: {
    width: "min(720px, 100%)",
    textAlign: "center",
    background: "#ffffff",
    borderRadius: "20px",
    padding: "48px 28px",
    boxShadow:
      "0 20px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)",
  },

  logo: {
    width: "min(520px, 100%)",
    height: "auto",
    marginBottom: "28px",
  },

  title: {
    fontSize: "34px",
    margin: "0 0 8px",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    color: "#0b0f19",
  },

  date: {
    fontSize: "20px",
    margin: "0 0 20px",
    fontWeight: 700,
    color: "#4f46e5", // subtle launch accent
  },

  sub: {
    margin: 0,
    fontSize: "16px",
    color: "#4b5563",
    lineHeight: 1.6,
  },
};
