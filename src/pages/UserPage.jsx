import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, isLoggedIn } from "../utils/api";

const diseaseOptions = ["None", "Diabetes", "Hypertension", "Heart Disease", "Asthma", "Cancer", "Kidney Disease", "Liver Disease", "Thyroid Disorder"];
const allergyOptions = ["None", "Penicillin", "Aspirin", "Ibuprofen", "Pollen", "Dust", "Peanuts", "Shellfish", "Latex"];
const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"];

export default function UserPage() {
  const navigate = useNavigate();

  // ── page-level states ──────────────────────────────────────────
  const [pageLoading, setPageLoading] = useState(true);   // loading profile from API
  const [saving, setSaving]           = useState(false);  // saving in progress
  const [error, setError]             = useState("");     // save/load error message
  const [editing, setEditing]         = useState(false);  // view vs edit mode

  // ── form field states (same as before) ────────────────────────
  const [name, setName]               = useState("");
  const [age, setAge]                 = useState("");
  const [gender, setGender]           = useState("");
  const [height, setHeight]           = useState("");
  const [weight, setWeight]           = useState("");
  const [blood, setBlood]             = useState("");
  const [diseases, setDiseases]       = useState([]);
  const [allergies, setAllergies]     = useState([]);
  const [medications, setMedications] = useState("");
  const [smoking, setSmoking]         = useState("no");
  const [alcohol, setAlcohol]         = useState("no");
  const [customDisease, setCustomDisease] = useState("");
  const [customAllergy, setCustomAllergy] = useState("");

  // ── load profile from backend on mount ────────────────────────
  useEffect(() => {
    // not logged in → back to home
    if (!isLoggedIn()) {
      navigate("/");
      return;
    }

    const loadProfile = async () => {
      try {
        const data = await api.authGet("/profile");

        if (data && data.name) {
          // profile exists → populate fields and show view mode
          setName(data.name || "");
          setAge(data.age || "");
          setGender(data.gender || "");
          setHeight(data.height || "");
          setWeight(data.weight || "");
          setBlood(data.bloodType || "");   // note: backend uses "bloodType"
          setDiseases(data.diseases || []);
          setAllergies(data.allergies || []);
          setMedications(data.medications?.join(", ") || "");
          setSmoking(data.smoking || "no");
          setAlcohol(data.alcohol || "no");
          setEditing(false); // show view mode
        } else {
          // no profile yet → open edit mode straight away
          setEditing(true);
        }
      } catch (err) {
        console.error("Failed to load profile:", err.message);
        // if token is bad/expired, send to login
        if (err.message.toLowerCase().includes("authorized")) {
          navigate("/");
        } else {
          setError("Could not load your profile. Please try again.");
          setEditing(true); // let them fill it fresh
        }
      } finally {
        setPageLoading(false);
      }
    };

    loadProfile();
  }, []);

  // ── save profile to backend ───────────────────────────────────
  const handleSave = async () => {
    if (!name.trim()) return setError("Enter your name.");
    if (!age || parseInt(age) < 1) return setError("Enter a valid age.");
    if (!gender) return setError("Select your gender.");

    setSaving(true);
    setError("");

    try {
      await api.authPost("/profile", {
        name,
        age: parseInt(age),
        gender,
        height: height ? Number(height) : null,
        weight: weight ? Number(weight) : null,
        bloodType: blood,          // backend field is "bloodType"
        diseases,
        allergies,
        medications: medications   // backend stores as string, schema handles it
          ? medications.split(",").map(m => m.trim()).filter(Boolean)
          : [],
        smoking,
        alcohol,
      });

      // update the name shown on the home welcome screen
      localStorage.setItem("aidUserName", name);
      localStorage.setItem("aidProfileComplete", "true");
      setEditing(false);
    } catch (err) {
      setError("Failed to save profile. Please try again.");
      console.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── unchanged helpers ─────────────────────────────────────────
  const toggleItem = (list, setList, item) => {
    if (item === "None") { setList(["None"]); return; }
    setList((prev) => {
      const filtered = prev.filter((i) => i !== "None");
      return filtered.includes(item)
        ? filtered.filter((i) => i !== item)
        : [...filtered, item];
    });
  };

  const addCustomDisease = () => {
    if (customDisease.trim()) {
      setDiseases(prev => [...prev.filter(i => i !== "None"), customDisease.trim()]);
      setCustomDisease("");
    }
  };

  const addCustomAllergy = () => {
    if (customAllergy.trim()) {
      setAllergies(prev => [...prev.filter(i => i !== "None"), customAllergy.trim()]);
      setCustomAllergy("");
    }
  };

  const bmi = height && weight
    ? (weight / ((height / 100) ** 2)).toFixed(1)
    : null;

  // ── get display email from localStorage ───────────────────────
  const userEmail = localStorage.getItem("aidUserEmail") || "";

  // ── loading screen ────────────────────────────────────────────
  if (pageLoading) {
    return (
      <div style={{ ...styles.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#3a8aaa", fontSize: "15px" }}>Loading your profile...</p>
      </div>
    );
  }

  // ── everything below is identical to your original JSX ────────
  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <div style={styles.avatar}>👤</div>
          <h1 style={styles.title}>Your Health Profile</h1>
          <p style={styles.sub}>{userEmail}</p>
        </div>

        {!editing ? (
          <>
            <div style={styles.card}>
              <p style={styles.sectionLabel}>📋 Personal Information</p>
              <div style={styles.infoGrid}>
                {[
                  ["Name", name],
                  ["Age", age],
                  ["Gender", gender],
                  ["Height", height ? `${height} cm` : "—"],
                  ["Weight", weight ? `${weight} kg` : "—"],
                  ["Blood Type", blood || "—"],
                  ["BMI", bmi || "—"],
                ].map(([label, value]) => (
                  <div key={label} style={styles.infoItem}>
                    <p style={styles.infoLabel}>{label}</p>
                    <p style={styles.infoValue}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.card}>
              <p style={styles.sectionLabel}>🏥 Medical History</p>
              <p style={styles.infoLabel}>Conditions</p>
              <div style={{ ...styles.chipRow, marginBottom: "12px" }}>
                {(diseases.length ? diseases : ["None"]).map((d) => (
                  <span key={d} style={styles.diseaseChip}>{d}</span>
                ))}
              </div>
              <p style={styles.infoLabel}>Allergies</p>
              <div style={{ ...styles.chipRow, marginBottom: "12px" }}>
                {(allergies.length ? allergies : ["None"]).map((a) => (
                  <span key={a} style={styles.allergyChip}>{a}</span>
                ))}
              </div>
              {medications && (
                <>
                  <p style={styles.infoLabel}>Medications</p>
                  <p style={styles.infoValue}>{medications}</p>
                </>
              )}
            </div>

            <div style={styles.card}>
              <p style={styles.sectionLabel}>🚬 Lifestyle</p>
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <p style={styles.infoLabel}>Smoking</p>
                  <p style={styles.infoValue}>{smoking}</p>
                </div>
                <div style={styles.infoItem}>
                  <p style={styles.infoLabel}>Alcohol</p>
                  <p style={styles.infoValue}>{alcohol}</p>
                </div>
              </div>
            </div>

            <button onClick={() => setEditing(true)} style={styles.editBtn}>
              Edit Profile ✏️
            </button>
          </>
        ) : (
          <>
            <div style={styles.card}>
              <p style={styles.sectionLabel}>📋 Personal Information</p>
              <div style={styles.grid}>
                {[
                  ["Full Name", name, setName, "text", "e.g. Ahmad Hassan"],
                  ["Age", age, setAge, "number", "e.g. 28"],
                  ["Height (cm)", height, setHeight, "number", "e.g. 170"],
                  ["Weight (kg)", weight, setWeight, "number", "e.g. 65"],
                ].map(([label, val, setter, type, ph]) => (
                  <div key={label} style={styles.formGroup}>
                    <label style={styles.label}>{label}</label>
                    <input
                      style={styles.input}
                      type={type}
                      placeholder={ph}
                      value={val}
                      onChange={(e) => setter(e.target.value)}
                    />
                  </div>
                ))}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Gender</label>
                  <select style={styles.input} value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Blood Type</label>
                  <select style={styles.input} value={blood} onChange={(e) => setBlood(e.target.value)}>
                    <option value="">Select</option>
                    {bloodTypes.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div style={styles.card}>
              <p style={styles.sectionLabel}>🏥 Medical History</p>

              <p style={styles.label}>Chronic Conditions</p>
              <div style={{ ...styles.chipRow, marginBottom: "10px", marginTop: "8px" }}>
                {diseaseOptions.map((d) => (
                  <button key={d} onClick={() => toggleItem(diseases, setDiseases, d)}
                    style={{ ...styles.chip, ...(diseases.includes(d) ? styles.chipDisease : styles.chipInactive) }}>
                    {diseases.includes(d) ? "✓ " : ""}{d}
                  </button>
                ))}
                {diseases.filter(d => !diseaseOptions.includes(d)).map((d) => (
                  <button key={d} onClick={() => setDiseases(prev => prev.filter(i => i !== d))}
                    style={{ ...styles.chip, ...styles.chipDisease }}>
                    ✓ {d} ✕
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                <input style={{ ...styles.input, flex: 1 }} placeholder="Add custom condition..."
                  value={customDisease} onChange={(e) => setCustomDisease(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomDisease()} />
                <button onClick={addCustomDisease}
                  style={{ padding: "9px 16px", background: "#3a8aaa", border: "none", borderRadius: "8px", color: "#000", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>
                  Add
                </button>
              </div>

              <p style={styles.label}>Allergies</p>
              <div style={{ ...styles.chipRow, marginBottom: "10px", marginTop: "8px" }}>
                {allergyOptions.map((a) => (
                  <button key={a} onClick={() => toggleItem(allergies, setAllergies, a)}
                    style={{ ...styles.chip, ...(allergies.includes(a) ? styles.chipAllergy : styles.chipInactive) }}>
                    {allergies.includes(a) ? "✓ " : ""}{a}
                  </button>
                ))}
                {allergies.filter(a => !allergyOptions.includes(a)).map((a) => (
                  <button key={a} onClick={() => setAllergies(prev => prev.filter(i => i !== a))}
                    style={{ ...styles.chip, ...styles.chipAllergy }}>
                    ✓ {a} ✕
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                <input style={{ ...styles.input, flex: 1 }} placeholder="Add custom allergy..."
                  value={customAllergy} onChange={(e) => setCustomAllergy(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomAllergy()} />
                <button onClick={addCustomAllergy}
                  style={{ padding: "9px 16px", background: "#f59e0b", border: "none", borderRadius: "8px", color: "#000", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>
                  Add
                </button>
              </div>

              <p style={styles.label}>Current Medications</p>
              <input style={{ ...styles.input, width: "100%", boxSizing: "border-box", marginTop: "8px" }}
                placeholder="e.g. Metformin, Lisinopril"
                value={medications}
                onChange={(e) => setMedications(e.target.value)} />
            </div>

            <div style={styles.card}>
              <p style={styles.sectionLabel}>🚬 Lifestyle</p>
              {[["Smoking", smoking, setSmoking], ["Alcohol", alcohol, setAlcohol]].map(([label, val, setter]) => (
                <div key={label} style={{ marginBottom: "14px" }}>
                  <p style={styles.label}>{label}</p>
                  <div style={{ ...styles.chipRow, marginTop: "8px" }}>
                    {["no", "occasionally", "regularly"].map((opt) => (
                      <button key={opt} onClick={() => setter(opt)}
                        style={{ ...styles.chip, ...(val === opt ? styles.chipActive : styles.chipInactive) }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* error message shown above the save button */}
            {error && <p style={styles.errorMsg}>{error}</p>}

            <button
              onClick={handleSave}
              disabled={saving}
              style={{ ...styles.saveBtn, opacity: saving ? 0.7 : 1, cursor: saving ? "not-allowed" : "pointer" }}
            >
              {saving ? "Saving..." : "Save Profile ✓"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#0a1f2e", color: "#e8f0f8", fontFamily: "'Instrument Sans', sans-serif" },
  wrapper: { maxWidth: "680px", margin: "0 auto", padding: "40px 24px 60px" },
  header: { textAlign: "center", marginBottom: "28px" },
  avatar: { fontSize: "52px", marginBottom: "10px" },
  title: { fontFamily: "'Syne', sans-serif", fontSize: "24px", fontWeight: "800", color: "#e8f0f8", margin: "0 0 6px" },
  sub: { fontSize: "12px", color: "#4a5f76" },
  card: { background: "#0f1419", border: "1px solid #1e2a36", borderRadius: "14px", padding: "20px", marginBottom: "14px" },
  sectionLabel: { fontSize: "11px", color: "#6b7f96", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "600", marginBottom: "14px", marginTop: 0 },
  infoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "10px" },
  infoItem: { background: "#161d26", borderRadius: "8px", padding: "10px 12px" },
  infoLabel: { fontSize: "10px", color: "#4a5f76", marginBottom: "4px", marginTop: 0 },
  infoValue: { fontSize: "14px", fontWeight: "600", color: "#e8f0f8", margin: 0, textTransform: "capitalize" },
  chipRow: { display: "flex", flexWrap: "wrap", gap: "8px" },
  diseaseChip: { padding: "4px 12px", borderRadius: "20px", fontSize: "12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" },
  allergyChip: { padding: "4px 12px", borderRadius: "20px", fontSize: "12px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", color: "#f59e0b" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px" },
  formGroup: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontSize: "12px", color: "#6b7f96", fontWeight: "500", margin: 0 },
  input: { padding: "9px 13px", background: "#161d26", border: "1px solid #1e2a36", borderRadius: "8px", color: "#e8f0f8", fontSize: "13px", fontFamily: "inherit", outline: "none" },
  chip: { padding: "6px 14px", borderRadius: "20px", fontSize: "12px", cursor: "pointer", border: "1px solid #1e2a36", fontFamily: "inherit" },
  chipActive: { background: "rgba(58,138,170,0.12)", border: "1px solid #3a8aaa", color: "#3a8aaa", fontWeight: "600" },
  chipDisease: { background: "rgba(239,68,68,0.12)", border: "1px solid #ef4444", color: "#ef4444", fontWeight: "600" },
  chipAllergy: { background: "rgba(245,158,11,0.12)", border: "1px solid #f59e0b", color: "#f59e0b", fontWeight: "600" },
  chipInactive: { background: "transparent", color: "#6b7f96" },
  saveBtn: { width: "100%", padding: "13px", background: "#3a8aaa", color: "#000", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", fontFamily: "inherit" },
  editBtn: { width: "100%", padding: "13px", background: "transparent", color: "#3a8aaa", border: "1px solid #3a8aaa", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" },
  errorMsg: { color: "#e05c5c", fontSize: "13px", marginBottom: "10px", textAlign: "center" },
};