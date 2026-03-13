import { useEffect, useState } from "react";

const levelConfig = {
  Low: { color: "#22c55e", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.3)", emoji: "✅", message: "You're in good shape. Monitor your symptoms and stay hydrated." },
  Moderate: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)", emoji: "⚠️", message: "Some concerns detected. Consider visiting a clinic soon." },
  High: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)", emoji: "🚨", message: "High risk detected. Please see a doctor as soon as possible." },
  Emergency: { color: "#ff0000", bg: "rgba(255,0,0,0.15)", border: "rgba(255,0,0,0.5)", emoji: "🆘", message: "EMERGENCY! Seek immediate medical attention or call emergency services." },
};

export default function RiskResultCard({ result, profile, onRetake }) {
  const { score, level } = result;
  const config = levelConfig[level];
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const timer = setInterval(() => {
      start += 2;
      if (start >= score) { setAnimatedScore(score); clearInterval(timer); }
      else setAnimatedScore(start);
    }, 20);
    return () => clearInterval(timer);
  }, [score]);

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <p style={styles.name}>{profile.name}, {profile.age} • {profile.gender}</p>
        <h2 style={styles.title}>Your Risk Assessment</h2>
      </div>

      {/* Score Card */}
      <div style={{ ...styles.scoreCard, background: config.bg, border: `1px solid ${config.border}` }}>
        <div style={styles.scoreRow}>
          <span style={styles.emoji}>{config.emoji}</span>
          <div>
            <div style={{ ...styles.scoreBig, color: config.color }}>{animatedScore}</div>
            <div style={styles.scoreLabel}>out of 100</div>
          </div>
          <div style={{ ...styles.levelBadge, color: config.color, border: `1px solid ${config.border}` }}>
            {level}
          </div>
        </div>

        {/* Progress Bar */}
        <div style={styles.barBg}>
          <div style={{ ...styles.barFill, width: `${score}%`, background: config.color }} />
        </div>

        <p style={{ ...styles.message, color: config.color }}>{config.emoji} {config.message}</p>
      </div>

      {/* Symptoms Summary */}
      <div style={styles.card}>
        <p style={styles.sectionLabel}>🤒 Reported Symptoms</p>
        <div style={styles.chipRow}>
          {profile.selectedSymptoms.map((s) => (
            <span key={s} style={styles.symptomChip}>{s}</span>
          ))}
        </div>
      </div>

      {/* Conditions */}
      {profile.selectedConditions.length > 0 && (
        <div style={styles.card}>
          <p style={styles.sectionLabel}>🏥 Pre-existing Conditions</p>
          <div style={styles.chipRow}>
            {profile.selectedConditions.map((c) => (
              <span key={c} style={styles.conditionChip}>{c}</span>
            ))}
          </div>
        </div>
      )}

      {/* Risk Ranges */}
      <div style={styles.card}>
        <p style={styles.sectionLabel}>📊 Risk Scale</p>
        <div style={styles.rangeRow}>
          {[["Low", "0–30", "#22c55e"], ["Moderate", "31–60", "#f59e0b"], ["High", "61–85", "#ef4444"], ["Emergency", "86–100", "#ff0000"]].map(([lv, range, color]) => (
            <div key={lv} style={{ ...styles.rangeItem, border: `1px solid ${lv === level ? color : "#1e2a36"}`, background: lv === level ? `rgba(0,0,0,0.3)` : "transparent" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color }} />
              <div>
                <div style={{ fontSize: "11px", color: lv === level ? color : "#6b7f96", fontWeight: lv === level ? "700" : "400" }}>{lv}</div>
                <div style={{ fontSize: "10px", color: "#4a5f76" }}>{range}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={onRetake} style={styles.retakeBtn}>← Retake Assessment</button>
    </div>
  );
}

const styles = {
  wrapper: { maxWidth: "780px", margin: "0 auto", padding: "32px 24px 60px" },
  header: { textAlign: "center", marginBottom: "24px" },
  name: { fontSize: "13px", color: "#6b7f96", marginBottom: "6px", marginTop: 0 },
  title: { fontFamily: "'Syne', sans-serif", fontSize: "26px", fontWeight: "800", color: "#e8f0f8", margin: 0 },
  scoreCard: { borderRadius: "14px", padding: "24px", marginBottom: "16px" },
  scoreRow: { display: "flex", alignItems: "center", gap: "20px", marginBottom: "16px" },
  emoji: { fontSize: "40px" },
  scoreBig: { fontSize: "52px", fontWeight: "800", fontFamily: "'Syne', sans-serif", lineHeight: 1 },
  scoreLabel: { fontSize: "12px", color: "#6b7f96" },
  levelBadge: { marginLeft: "auto", padding: "6px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "700", background: "transparent" },
  barBg: { height: "6px", background: "#1e2a36", borderRadius: "10px", overflow: "hidden", marginBottom: "14px" },
  barFill: { height: "100%", borderRadius: "10px", transition: "width 1s ease" },
  message: { fontSize: "13px", fontWeight: "600", margin: 0 },
  card: { background: "#0f1419", border: "1px solid #1e2a36", borderRadius: "14px", padding: "20px", marginBottom: "12px" },
  sectionLabel: { fontSize: "11px", color: "#6b7f96", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "600", marginBottom: "12px", marginTop: 0 },
  chipRow: { display: "flex", flexWrap: "wrap", gap: "8px" },
  symptomChip: { padding: "5px 12px", borderRadius: "20px", fontSize: "12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" },
  conditionChip: { padding: "5px 12px", borderRadius: "20px", fontSize: "12px", background: "rgba(58,138,170,0.1)", border: "1px solid rgba(58,138,170,0.3)", color: "#3a8aaa" },
  rangeRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" },
  rangeItem: { borderRadius: "8px", padding: "10px 8px", display: "flex", alignItems: "center", gap: "8px" },
  retakeBtn: { width: "100%", padding: "13px", background: "transparent", color: "#3a8aaa", border: "1px solid #3a8aaa", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", marginTop: "8px" },
};