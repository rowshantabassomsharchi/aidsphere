import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileForm from "../components/ProfileForm";
import RiskResultCard from "../components/RiskResultCard";

export default function AssessmentPage() {
  const [result, setResult] = useState(null);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (!savedProfile) navigate("/user");
  }, []);

  const handleSubmit = (data) => {
    const { result, ...profileData } = data;
    setProfile(profileData);
    setResult(result);
    const history = JSON.parse(localStorage.getItem("riskHistory") || "[]");
    history.unshift({ ...profileData, result, date: new Date().toISOString() });
    localStorage.setItem("riskHistory", JSON.stringify(history.slice(0, 20)));
  };

  const handleRetake = () => {
    setResult(null);
    setProfile(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a1f2e", color: "#e8f0f8", fontFamily: "'Instrument Sans', sans-serif" }}>
      {result && profile ? (
        <RiskResultCard result={result} profile={profile} onRetake={handleRetake} />
      ) : (
        <ProfileForm onSubmit={handleSubmit} />
      )}
    </div>
  );
}