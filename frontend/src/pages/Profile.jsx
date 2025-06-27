import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const { isLoggedIn, user, loading, setUser } = useAuth();
  const BACKEND = import.meta.env.VITE_BACKEND_URL;

  const [form, setForm] = useState({
    age: user?.age || "",
    height: user?.height || "",
    weight: user?.weight || "",
    gender: user?.gender || "female",
    fitnessGoal: user?.fitnessGoal || "",
    dietaryPreferences: user?.dietaryPreferences || "",
  });

  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const calculateBMI = () => {
    const h = form.height / 100;
    return form.weight && form.height ? (form.weight / (h * h)).toFixed(1) : "N/A";
  };

  const calculateBMR = () => {
    const { weight, height, age, gender } = form;
    if (!weight || !height || !age) return "N/A";
    return gender === "male"
      ? (10 * weight + 6.25 * height - 5 * age + 5).toFixed(0)
      : (10 * weight + 6.25 * height - 5 * age - 161).toFixed(0);
  };

  const handleSave = async () => {
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch(`${BACKEND}/update-profile`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const updated = await res.json();
        setUser(updated);

        const freshRes = await fetch(`${BACKEND}/profile`, {
          credentials: "include",
        });

        if (freshRes.ok) {
          const freshUser = await freshRes.json();
          setUser(freshUser);
        }

        setStatus({ type: "success", message: "Profile updated successfully." });
      } else {
        const error = await res.json();
        setStatus({
          type: "error",
          message: error?.message || "Update failed. Please try again.",
        });
      }
    } catch (err) {
      console.error("❌ Error updating profile:", err);
      setStatus({ type: "error", message: "Something went wrong. Try again later." });
    }
  };

  useEffect(() => {
    if (!isLoggedIn && !loading) navigate("/login");
  }, [isLoggedIn, loading, navigate]);

  if (loading) return <div>Loading profile...</div>;
  if (!user) return <div>User not found. Please login again.</div>;

  return (
    <div className="space-y-6 px-4 py-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Manage your account and health info.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="items-center text-center">
            <CardTitle>{user.username}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-center text-sm text-muted-foreground">
            <div>BMI: <strong>{calculateBMI()}</strong></div>
            <div>BMR: <strong>{calculateBMR()}</strong> kcal/day</div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Health & Fitness</CardTitle>
              <CardDescription>Update your personal stats and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {status.message && (
                <div
                  className={`rounded-md px-4 py-2 text-sm font-medium ${
                    status.type === "success"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-red-100 text-red-700 border border-red-300"
                  }`}
                >
                  {status.message}
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" value={form.age} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input id="height" type="number" value={form.height} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" type="number" value={form.weight} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-md shadow-sm border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-[hsl(var(--primary))] transition-colors"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fitnessGoal">Fitness Goal</Label>
                <select
                  id="fitnessGoal"
                  value={form.fitnessGoal}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-md shadow-sm border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-[hsl(var(--primary))] transition-colors"
                >
                  <option value="">Select a goal</option>
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Muscle Gain">Weight Gain</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dietaryPreferences">Dietary Preferences</Label>
                <select
                  id="dietaryPreferences"
                  value={form.dietaryPreferences}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-md shadow-sm border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-[hsl(var(--primary))] transition-colors"
                >
                  <option value="">Select preference</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Gluten-Free">Gluten-Free</option>
                  <option value="Lactose-Free">Lactose-Free</option>
                  <option value="Nut Allergy">Nut Allergy</option>
                  <option value="None">None</option>
                </select>
              </div>

              <Button className="mt-4" onClick={handleSave}>Save Changes</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
