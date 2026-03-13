import { useEffect, useState } from "react";

const levelColors = {
  Low: "#22c55e",
  Moderate: "#f59e0b",
  High: "#ef4444",
  Emergency: "#ff0000",
};

export default function HistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("riskHistory") || "[]");
    setHistory(saved);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("riskHistory");
    setHistory([]);
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>Assessment History</h1>
          {history.length > 0 && (
            <button onClick={clearHistory} style={styles.clearBtn}>Clear All</button>
          )}
        </div>

        {history.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>📋</div>
            <p style={{ color: "#6b7f96" }}>No assessments yet. Take one first!</p>
          </div>
        ) : (
          history.map((entry, i) => (
            <div key={i} style={styles.card}>
              <div style={styles.cardTop}>
                <div>
                  <p style={styles.name}>{entry.name}, {entry.age} • {entry.gender}</p>
                  <p style={styles.date}>{new Date(entry.date).toLocaleString()}</p>
                </div>
                <div style={{ ...styles.badge, color: levelColors[entry.result.level], borderColor: levelColors[entry.result.level] }}>
                  {entry.result.level}
                </div>
                <div style={{ ...styles.score, color: levelColors[entry.result.level] }}>
                  {entry.result.score}
                </div>
              </div>
              <div style={styles.chipRow}>
                {entry.selectedSymptoms.map((s) => (
                  <span key={s} style={styles.chip}>{s}</span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#0a1f2e", color: "#e8f0f8", fontFamily: "'Instrument Sans', sans-serif" },
  wrapper: { maxWidth: "780px", margin: "0 auto", padding: "32px 24px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  title: { fontFamily: "'Syne', sans-serif", fontSize: "26px", fontWeight: "800", color: "#e8f0f8", margin: 0 },
  clearBtn: { padding: "7px 16px", background: "transparent", border: "1px solid #ef4444", color: "#ef4444", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontFamily: "inherit" },
  empty: { textAlign: "center", padding: "80px 0" },
  card: { background: "#0f1419", border: "1px solid #1e2a36", borderRadius: "14px", padding: "18px", marginBottom: "12px" },
  cardTop: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" },
  name: { fontSize: "14px", fontWeight: "600", color: "#e8f0f8", margin: "0 0 2px" },
  date: { fontSize: "11px", color: "#4a5f76", margin: 0 },
  badge: { marginLeft: "auto", padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", border: "1px solid" },
  score: { fontSize: "28px", fontWeight: "800", fontFamily: "'Syne', sans-serif" },
  chipRow: { display: "flex", flexWrap: "wrap", gap: "6px" },
  chip: { padding: "3px 10px", borderRadius: "20px", fontSize: "11px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" },
};