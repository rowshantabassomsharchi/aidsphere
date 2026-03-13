import { useState } from "react";
import { calculateRisk } from "../utils/riskEngine";
import { symptomCategories, existingConditions } from "../data/symptoms";

export default function ProfileForm({ onSubmit }) {
  const profile = JSON.parse(localStorage.getItem("userProfile") || "null");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const toggleCondition = (condition) => {
    setSelectedConditions((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition]
    );
  };

  const handleSubmit = () => {
    if (!profile) return alert("Please complete your profile first.");
    if (selectedSymptoms.length === 0) return alert("Please select at least one symptom.");

    const result = calculateRisk(selectedSymptoms, selectedConditions, profile.age);
    onSubmit({ ...profile, selectedSymptoms, selectedConditions, result });
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <div style={styles.headerIcon}>🩺</div>
        <h1 style={styles.title}>How are you feeling?</h1>
        {profile && <p style={styles.subtitle}>Hi {profile.name}, select your symptoms below</p>}
      </div>

      <section style={styles.card}>
        <p style={styles.sectionLabel}>🤒 Current Symptoms</p>
        <p style={styles.hint}>Tap to toggle — select all that apply</p>
        {symptomCategories.map((category) => (
          <div key={category.name} style={styles.categoryBlock}>
            <p style={styles.categoryLabel}>{category.name}</p>
            <div style={styles.chipRow}>
              {category.symptoms.map((symptom) => {
                const active = selectedSymptoms.includes(symptom);
                return (
                  <button key={symptom} onClick={() => toggleSymptom(symptom)}
                    style={{ ...styles.chip, ...(active ? styles.chipActive : styles.chipInactive) }}>
                    {active ? "✓ " : ""}{symptom}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {selectedSymptoms.length > 0 && (
          <div style={styles.selectedBadge}>
            ✓ {selectedSymptoms.length} symptom{selectedSymptoms.length > 1 ? "s" : ""} selected
          </div>
        )}
      </section>

      <section style={styles.card}>
        <p style={styles.sectionLabel}>🏥 Existing Conditions</p>
        <p style={styles.hint}>Select any pre-existing conditions</p>
        <div style={styles.chipRow}>
          {existingConditions.map((condition) => {
            const active = selectedConditions.includes(condition);
            return (
              <button key={condition} onClick={() => toggleCondition(condition)}
                style={{ ...styles.chip, ...(active ? styles.chipConditionActive : styles.chipInactive) }}>
                {active ? "✓ " : ""}{condition}
              </button>
            );
          })}
        </div>
      </section>

      <button onClick={handleSubmit} style={styles.submitBtn}>
        Analyze My Risk →
      </button>
    </div>
  );
}

const styles = {
  wrapper: { maxWidth: "780px", margin: "0 auto", padding: "32px 24px 60px" },
  header: { textAlign: "center", marginBottom: "32px" },
  headerIcon: { fontSize: "48px", marginBottom: "12px" },
  title: { fontFamily: "'Syne', sans-serif", fontSize: "28px", fontWeight: "800", color: "#e8f0f8", margin: "0 0 8px" },
  subtitle: { fontSize: "14px", color: "#6b7f96", margin: 0 },
  card: { background: "#0f1419", border: "1px solid #1e2a36", borderRadius: "14px", padding: "22px", marginBottom: "16px" },
  sectionLabel: { fontSize: "11px", color: "#6b7f96", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "600", marginBottom: "14px", marginTop: 0 },
  hint: { fontSize: "12px", color: "#4a5f76", marginBottom: "14px", marginTop: "-8px" },
  categoryBlock: { marginBottom: "16px" },
  categoryLabel: { fontSize: "12px", color: "#3a8aaa", fontWeight: "600", marginBottom: "8px", marginTop: 0 },
  chipRow: { display: "flex", flexWrap: "wrap", gap: "8px" },
  chip: { padding: "6px 14px", borderRadius: "20px", fontSize: "12px", cursor: "pointer", border: "1px solid #1e2a36", fontFamily: "inherit", transition: "all 0.15s" },
  chipActive: { background: "rgba(239,68,68,0.12)", border: "1px solid #ef4444", color: "#ef4444", fontWeight: "600" },
  chipConditionActive: { background: "rgba(58,138,170,0.12)", border: "1px solid #3a8aaa", color: "#3a8aaa", fontWeight: "600" },
  chipInactive: { background: "transparent", color: "#6b7f96" },
  selectedBadge: { marginTop: "14px", display: "inline-block", padding: "5px 14px", background: "rgba(58,138,170,0.1)", border: "1px solid rgba(58,138,170,0.25)", borderRadius: "20px", fontSize: "12px", color: "#3a8aaa", fontWeight: "600" },
  submitBtn: { width: "100%", padding: "14px", background: "#3a8aaa", color: "#000", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", marginTop: "8px" },
};