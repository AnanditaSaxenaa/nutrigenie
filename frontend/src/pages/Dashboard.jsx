import GoalForm from "../features/GoalForm";
import { generateDietPlan } from "../lib/gemini";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const createDietPlan = async (formData) => {
    setLoading(true);
    setError("");

    try {
      const response = await generateDietPlan(formData);

      const jsonText = response
        .replace(/```json/, "")
        .replace(/```/, "")
        .trim();

      let parsed;
      try {
        parsed = JSON.parse(jsonText);
      } catch (parseErr) {
        console.error("❌ Failed to parse diet plan JSON:", parseErr);
        throw new Error("AI response couldn't be parsed. Please try again.");
      }

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/createDietPlan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(parsed),
      });

      if (!res.ok) {
        throw new Error("Failed to save diet plan on server");
      }

      localStorage.setItem("dietPlan", JSON.stringify(parsed));
      navigate("/dietPlan", { state: { dietPlan: parsed } });

    } catch (err) {
      console.error("❌ Error generating diet plan:", err);
      setError(err.message || "Failed to generate diet plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 py-8 max-w-5xl mx-auto min-h-screen text-[hsl(var(--foreground))]">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        🍽️ Personalized Diet Planner
      </h1>

      <GoalForm onSubmit={createDietPlan} />

      {loading && (
        <p className="mt-6 text-sm sm:text-base text-center text-[hsl(var(--primary))]">
          Generating your personalized diet plan...
        </p>
      )}

      {error && (
        <p className="mt-4 text-sm sm:text-base text-center text-[hsl(var(--destructive))]">
          {error}
        </p>
      )}
    </div>
  );
}
