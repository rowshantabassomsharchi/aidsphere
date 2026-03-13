import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { label: "HOME", path: "/" },
    { label: "SYMPTOM", path: "/symptom" },
    { label: "HISTORY", path: "/history" },
    { label: "USER", path: "/user" },
  ];

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>AidSphere</Link>
      <div style={styles.links}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...styles.navBtn,
              ...(location.pathname === item.path ? styles.navBtnActive : {}),
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 32px",
    background: "rgba(13,20,30,0.85)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid #1e2a36",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontFamily: "'Caveat', cursive",
    fontSize: "24px",
    fontStyle: "italic",
    color: "#e8f0f8",
    textDecoration: "none",
    background: "#1a3a50",
    padding: "4px 16px",
    borderRadius: "20px",
    border: "1px solid #3a8aaa",
  },
  links: {
    display: "flex",
    gap: "8px",
  },
  navBtn: {
    padding: "6px 16px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    textDecoration: "none",
    color: "#6b7f96",
    background: "#1a1f2a",
    border: "1px solid #1e2a36",
    letterSpacing: "0.05em",
  },
  navBtnActive: {
    color: "#e8f0f8",
    background: "#2a3a4a",
    border: "1px solid #3a8aaa",
  },
};