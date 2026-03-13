const symptomWeights = {
    "Chest Pain": 40,
    "Difficulty Breathing": 35,
    "Fainting": 30,
    "Severe Headache": 25,
    "High Fever": 20,
    "Vomiting": 15,
    "Fatigue": 10,
    "Cough": 8,
    "Sore Throat": 5,
    "Mild Headache": 5,
    "Runny Nose": 3,
    "Body Ache": 8,
  };
  
  const conditionMultipliers = {
    "Diabetes": 1.2,
    "Hypertension": 1.2,
    "Heart Disease": 1.5,
    "Asthma": 1.3,
    "None": 1.0,
  };
  
  const ageMultiplier = (age) => {
    if (age >= 60) return 1.4;
    if (age >= 40) return 1.2;
    if (age >= 18) return 1.0;
    return 1.1;
  };
  
  export const calculateRisk = (symptoms, conditions, age) => {
    let score = 0;
  
    symptoms.forEach((symptom) => {
      score += symptomWeights[symptom] || 0;
    });
  
    conditions.forEach((condition) => {
      score *= conditionMultipliers[condition] || 1.0;
    });
  
    score *= ageMultiplier(age);
  
    score = Math.min(Math.round(score), 100);
  
    let level = "";
    if (score <= 30) level = "Low";
    else if (score <= 60) level = "Moderate";
    else if (score <= 85) level = "High";
    else level = "Emergency";
  
    return { score, level };
  };