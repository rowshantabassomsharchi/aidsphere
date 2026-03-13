import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user"));
  const [isRegistering, setIsRegistering] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleAuth = () => {
    if (!form.name && isRegistering) return alert("Enter your name.");
    if (!form.email) return alert("Enter your email.");
    if (!form.password) return alert("Enter your password.");

    const user = { name: form.name || form.email.split("@")[0], email: form.email };
    localStorage.setItem("user", JSON.stringify(user));
    setIsLoggedIn(true);

    const hasProfile = !!localStorage.getItem("userProfile");
    if (isRegistering || !hasProfile) {
      navigate("/user");
    } else {
      navigate("/symptom");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div style={styles.page}>
      {/* Background overlay */}
      <div style={styles.overlay} />

      <div style={styles.content}>
        {!isLoggedIn ? (
          <div style={styles.authCard}>
            <div style={styles.authIcon}>🩺</div>
            <h2 style={styles.authTitle}>{isRegistering ? "Create Account" : "Welcome Back"}</h2>
            <p style={styles.authSub}>AidSphere Health Risk Platform</p>

            <div style={styles.formGroup}>
              {isRegistering && (
                <input
                  style={styles.input}
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              )}
              <input
                style={styles.input}
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                style={styles.input}
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <button onClick={handleAuth} style={styles.authBtn}>
              {isRegistering ? "Register" : "Login"} →
            </button>

            <p style={styles.toggle}>
              {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
              <span style={styles.toggleLink} onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? "Login" : "Register"}
              </span>
            </p>
          </div>
        ) : (
          <div style={styles.welcome}>
            <p style={styles.greeting}>Good day,</p>
            <h1 style={styles.welcomeName}>{user?.name} 👋</h1>
            <p style={styles.question}>How are you feeling today?</p>
            <button onClick={() => navigate("/symptom")} style={styles.logBtn}>
              Log My Symptoms →
            </button>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", backgroundImage: "url('/bg.jpg')", backgroundSize: "cover", backgroundPosition: "center", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Instrument Sans', sans-serif" },
  overlay: { position: "absolute", inset: 0, background: "rgba(0,15,20,0.55)" },
  content: { position: "relative", zIndex: 1, width: "100%", maxWidth: "420px", padding: "24px" },
  authCard: { background: "rgba(10,20,30,0.92)", border: "1px solid #1e2a36", borderRadius: "18px", padding: "32px", textAlign: "center" },
  authIcon: { fontSize: "40px", marginBottom: "12px" },
  authTitle: { fontFamily: "'Syne', sans-serif", fontSize: "22px", fontWeight: "800", color: "#ffffff", margin: "0 0 6px" },
  authSub: { fontSize: "12px", color: "#ffffff", marginBottom: "24px" },
  formGroup: { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" },
  input: { padding: "10px 14px", background: "#161d26", border: "1px solid #1e2a36", borderRadius: "8px", color: "#e8f0f8", fontSize: "13px", fontFamily: "inherit", outline: "none" },
  authBtn: { width: "100%", padding: "12px", background: "#3a8aaa", color: "#000", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" },
  toggle: { fontSize: "12px", color: "#ffffff", marginTop: "16px", marginBottom: 0 },
  toggleLink: { color: "#3a8aaa", cursor: "pointer", fontWeight: "600" },
  welcome: { textAlign: "center" },
  greeting: { fontSize: "14px", color: "#ffffff", marginBottom: "4px" },
  welcomeName: { fontFamily: "'Syne', sans-serif", fontSize: "36px", fontWeight: "800", color: "#ffffff", margin: "0 0 12px" },
  question: { fontSize: "16px", color: "#ffffff", marginBottom: "32px" },
  logBtn: { display: "block", width: "100%", padding: "14px", background: "#3a8aaa", color: "#000", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", marginBottom: "12px" },
  logoutBtn: { background: "transparent", border: "1px solid #1e2a36", color: "#ffffff", padding: "8px 20px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontFamily: "inherit" },
};