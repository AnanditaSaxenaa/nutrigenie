import React, { useState } from "react";
import { Timeline } from "@material-tailwind/react";
import { Button } from "@/components/ui/button";
import StepperWithProgress from "../components/ui/StepperWithProgress";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function GoalForm({ onSubmit }) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    targetWeight: "",
    goal: "",
    healthIssues: [],
    foodPreference: "",
    taste: "",
    allergies: "",
    days: 7,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "healthIssues") {
      let newHealth = [...formData.healthIssues];
      if (checked) {
        if (!newHealth.includes(value)) newHealth.push(value);
      } else {
        newHealth = newHealth.filter((h) => h !== value);
      }
      setFormData({ ...formData, healthIssues: newHealth });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  const inputClasses =
    "w-full px-3 py-2 text-sm rounded-md shadow-sm border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-[hsl(var(--primary))] transition-colors";

  return (
    <section className="w-full max-w-4xl mx-auto p-4">
      <StepperWithProgress step={step} />
      <Timeline mode="stepper" value={step} onChange={(val) => setStep(Number(val))}>
        {[0, 1, 2].map((val) => (
          <Timeline.Item key={val} value={val}>
            <Timeline.Header>
              <Timeline.Separator />
            </Timeline.Header>
          </Timeline.Item>
        ))}
      </Timeline>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl mx-auto">
        {step === 0 && (
          <>
            <h2 className="text-2xl font-bold mb-2">Personal Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <input name="age" placeholder="Age" value={formData.age} onChange={handleChange} className={inputClasses} />
              <input name="height" placeholder="Height (cm)" value={formData.height} onChange={handleChange} className={inputClasses} />
              <input name="weight" placeholder="Current Weight (kg)" value={formData.weight} onChange={handleChange} className={inputClasses} />
              <input name="targetWeight" placeholder="Target Weight (kg)" value={formData.targetWeight} onChange={handleChange} className={inputClasses} />
              <select name="gender" value={formData.gender} onChange={handleChange} className={`col-span-2 ${inputClasses}`}>
                <option value="">Select Gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold">Goals & Preferences</h2>

            <label className="block mt-4 font-medium">Goal</label>
            <select name="goal" value={formData.goal} onChange={handleChange} className={inputClasses}>
              <option value="">Select Goal</option>
              <option value="lose">Lose Weight</option>
              <option value="maintain">Maintain Weight</option>
              <option value="gain">Gain Weight</option>
            </select>

            <label className="block mt-4 font-medium">Food Preference</label>
            <select name="foodPreference" value={formData.foodPreference} onChange={handleChange} className={inputClasses}>
              <option value="">Select Food Preference</option>
              <option value="veg">Vegetarian</option>
              <option value="non-veg">Non-Vegetarian</option>
              <option value="vegan">Vegan</option>
            </select>

            <label className="block mt-4 font-medium">Taste Preference</label>
            <select name="taste" value={formData.taste} onChange={handleChange} className={inputClasses}>
              <option value="">Select Taste Preference</option>
              <option value="spicy">Spicy</option>
              <option value="mild">Mild</option>
              <option value="balanced">Balanced</option>
            </select>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold">Health & Duration</h2>

            <div className="flex gap-4 flex-wrap mt-2">
              {["diabetes", "bp", "thyroid"].map((issue) => (
                <label key={issue} className="flex items-center gap-2 px-3 py-2 rounded border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] text-sm">
                  <input
                    type="checkbox"
                    name="healthIssues"
                    value={issue}
                    checked={formData.healthIssues.includes(issue)}
                    onChange={handleChange}
                    className="accent-[hsl(var(--primary))]"
                  />
                  {issue === "bp" ? "High BP" : issue.charAt(0).toUpperCase() + issue.slice(1)}
                </label>
              ))}
            </div>

            <input type="number" name="days" placeholder="Number of days (e.g., 7)" value={formData.days} onChange={handleChange} className={`w-full mt-4 ${inputClasses}`} />

            <input name="allergies" placeholder="Any allergies?" value={formData.allergies} onChange={handleChange} className={`w-full mt-4 ${inputClasses}`} />

            {isLoggedIn ? (
              <Button type="submit" className="mt-6 px-6 py-2 w-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded">
                Generate Diet Plan
              </Button>
            ) : (
              <Button type="button" onClick={() => navigate("/register")} className="mt-6 px-6 py-2 w-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded">
                Login / Register to Continue
              </Button>
            )}
          </>
        )}
      </form>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>
          Previous
        </Button>
        <Button variant="outline" disabled={step === 2} onClick={() => setStep(step + 1)}>
          Next
        </Button>
      </div>
    </section>
  );
}
