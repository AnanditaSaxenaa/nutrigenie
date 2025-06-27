import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import DietPlanPDF from '@/components/DietPlanPDF';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from "@/components/ui/button";
import toast from 'react-hot-toast';

export default function DietPlanPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user } = useAuth();

  const [dietPlan, setDietPlan] = useState(() => {
    const cached = JSON.parse(localStorage.getItem("dietPlan") || "null");
    return location.state?.dietPlan || cached?.plan || null;
  });
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [planTitle, setPlanTitle] = useState("");
  const [publishing, setPublishing] = useState(false);


  useEffect(() => {
    if (!isLoggedIn || !user?.email) {
      navigate("/login");
      return;
    }

    const cached = JSON.parse(localStorage.getItem("dietPlan") || "null");

    if (cached && cached.userEmail === user.email && cached.plan) {
      setDietPlan(cached.plan);
    } else {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/latestDietPlan`, {
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Not authorized or no plan found");
          return res.json();
        })
        .then((data) => {
          setDietPlan(data);
          localStorage.setItem("dietPlan", JSON.stringify({
            userEmail: user.email,
            plan: data,
          }));
        })
        .catch((err) => {
          console.error("❌ Could not load diet plan", err);
          navigate("/dashboard");
        });
    }
  }, [isLoggedIn, user, navigate]);

  if (!dietPlan) return <div className="p-6 text-center text-lg">Loading your diet plan...</div>;


  const handlePublish = async () => {
    // ✅ Validate title first
    if (!planTitle.trim()) {
      toast.error("Please enter a title for the plan.");
      return;
    }
  
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/publish-diet-plan`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: planTitle, // user-defined title
          goal: dietPlan.dietSummary?.goal || "General",
          description: dietPlan.dietSummary?.description || "Generated using NutriGenie",
          data: dietPlan,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        toast.success("Diet plan published!");
      } else {
        toast.error(result.message || "Failed to publish plan");
      }
    } catch (err) {
      console.error("Error publishing plan:", err);
      toast.error("Server error while publishing");
    }
  };
  

  return (
    
    <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-10 space-y-8 mt-8 bg-background text-foreground">
      {/* PDF Download */}
      <div className="flex justify-end">
        <PDFDownloadLink
          document={<DietPlanPDF dietPlan={dietPlan} />}
          fileName="NutriGenie_DietPlan.pdf"
        >
          {({ loading }) => (
            <Button disabled={loading}>
              {loading ? 'Preparing PDF...' : 'Download as PDF'}
            </Button>
          )}
        </PDFDownloadLink>
        <div className="flex items-center gap-4 justify-between px-4">
      <Button onClick={() => setShowPublishModal(true)} variant="secondary">
        Publish This Plan
      </Button>

    </div>
      </div>
      


      {/* Goal Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">🎯 Goal Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{dietPlan?.dietSummary?.description || "No description provided."}</p>
        </CardContent>
      </Card>

      {/* Nutritional Targets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">📊 Nutritional Targets</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-6 space-y-1">
            <li>Calories: {dietPlan?.nutritionalTargets?.total_calories ?? "N/A"}</li>
            <li>Carbs: {dietPlan?.nutritionalTargets?.carbohydrates ?? "N/A"}</li>
            <li>Protein: {dietPlan?.nutritionalTargets?.protein ?? "N/A"}</li>
            <li>Fat: {dietPlan?.nutritionalTargets?.fat ?? "N/A"}</li>
          </ul>
        </CardContent>
      </Card>

      {/* Meal Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">🍽️ Meal Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue={Object.keys(dietPlan?.mealPlan || {})[0]}
            className="w-full space-y-4"
          >
            <TabsList className="flex flex-wrap gap-2">
              {Object.keys(dietPlan?.mealPlan || {}).map((dayKey) => (
                <TabsTrigger
                  key={dayKey}
                  value={dayKey}
                  className="px-4 py-2 rounded-full text-sm font-medium border bg-white shadow-sm data-[state=active]:bg-gray-100"
                >
                  {dayKey}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(dietPlan?.mealPlan || {}).map(([dayKey, meals]) => (
              <TabsContent key={dayKey} value={dayKey} className="mt-4 space-y-4">
                {Object.entries(meals).map(([mealKey, meal]) => (
                  <Card key={mealKey} className="border border-gray-300">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg capitalize">
                        {mealKey} — {meal.name}
                      </CardTitle>
                      <CardDescription>{meal.calories} kcal</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                      <p>🥩 Protein: <strong>{meal.protein}</strong></p>
                      <p>🍞 Carbs: <strong>{meal.carbs}</strong></p>
                      <p>🧈 Fat: <strong>{meal.fat}</strong></p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Recipes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">🍳 Recipes</CardTitle>
          <CardDescription>Click to view recipe details</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-6 space-y-2">
            {Object.entries(dietPlan?.recipes || {}).map(([recipeName, recipe]) => (
              <li
                key={recipeName}
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={() =>
                  navigate("/recipe", {
                    state: {
                      name: recipeName,
                      ingredients: recipe.ingredients,
                      instructions: recipe.instructions,
                    },
                  })
                }
              >
                {recipeName}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Grocery List */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="grocery">
          <AccordionTrigger className="text-xl font-semibold cursor-pointer">
            🛒 Grocery List
          </AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc ml-6 space-y-1">
              {dietPlan?.groceryList?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">💡 Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-6 space-y-1">
            {dietPlan?.dietTips?.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <p className="text-sm text-gray-500 mt-4 leading-relaxed">
        {dietPlan?.disclaimer || "This diet plan is AI-generated. Please consult a nutritionist before making major changes."}
      </p>
      {showPublishModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="bg-white dark:bg-background border rounded-xl shadow-lg w-full max-w-md p-6 space-y-4">
      <h2 className="text-xl font-semibold text-center">📝 Name Your Plan</h2>

      <input
        type="text"
        placeholder="e.g. Summer Shred Plan"
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
        value={planTitle}
        onChange={(e) => setPlanTitle(e.target.value)}
      />

      <div className="flex justify-end gap-3">
        <Button
          variant="ghost"
          onClick={() => {
            setPlanTitle("");
            setShowPublishModal(false);
          }}
        >
          Cancel
        </Button>

        <Button
          disabled={!planTitle || publishing}
          onClick={async () => {
            setPublishing(true);
            try {
              const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/publish-diet-plan`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  title: planTitle,
                  goal: dietPlan?.dietSummary?.goal || "General",
                  description: dietPlan?.dietSummary?.description || "Generated using NutriGenie",
                  data: dietPlan,
                }),
              });
              const result = await response.json();

              if (response.ok) {
                toast.success("Diet plan published!");
                setPlanTitle("");
                setShowPublishModal(false);
              } else {
                toast.error(result.message || "Failed to publish plan");
              }
            } catch (err) {
              toast.error("Server error while publishing");
              console.error(err);
            } finally {
              setPublishing(false);
            }
          }}
        >
          {publishing ? "Publishing..." : "Publish"}
        </Button>
      </div>
    </div>
  </div>
)}

    </div>
    
  );
}
