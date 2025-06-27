import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
export default function SinglePlanPage() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    async function fetchPlan() {
      try {
        const res = await fetch('http://localhost:4000/my-diet-plans', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        const selected = data.find(p => p._id === planId);
        if (!selected) return navigate('/my-plans');
        setPlan(selected);
      } catch (err) {
        console.error('Failed to load plan:', err);
        navigate('/my-plans');
      }
    }

    fetchPlan();
  }, [planId, navigate]);

  if (!plan) return <div className="p-4 text-center text-lg">Loading plan...</div>;

  const data = plan.data || {};

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 bg-background text-foreground">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{plan.title}</CardTitle>
          <CardDescription>
            Published on: {new Date(plan.date).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p><strong>🎯 Goal:</strong> {data.dietSummary?.goal || "N/A"} weight</p>
          <p><strong>📝 Description:</strong> {data.dietSummary?.description || "No description provided."}</p>
        </CardContent>
      </Card>

      {/* Nutritional Targets */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Nutritional Targets</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-6 space-y-1">
            <li>Calories: {data.nutritionalTargets?.total_calories ?? "N/A"}</li>
            <li>Carbs: {data.nutritionalTargets?.carbohydrates ?? "N/A"}</li>
            <li>Protein: {data.nutritionalTargets?.protein ?? "N/A"}</li>
            <li>Fat: {data.nutritionalTargets?.fat ?? "N/A"}</li>
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
      defaultValue={Object.keys(plan.data?.mealPlan || {})[0]}
      className="w-full space-y-4"
    >
      <TabsList className="flex flex-wrap gap-2">
        {Object.keys(plan.data?.mealPlan || {}).map((dayKey) => (
          <TabsTrigger
            key={dayKey}
            value={dayKey}
            className="px-4 py-2 rounded-full text-sm font-medium border bg-white shadow-sm data-[state=active]:bg-gray-100"
          >
            {dayKey}
          </TabsTrigger>
        ))}
      </TabsList>

      {Object.entries(plan.data?.mealPlan || {}).map(([dayKey, meals]) => (
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
      {data.recipes && Object.keys(data.recipes).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>🍳 Recipes</CardTitle>
            <CardDescription>Click to view recipe details</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-6 space-y-2">
              {Object.entries(data.recipes).map(([recipeName, recipe]) => (
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
      )}

      {/* Grocery List */}
      {Array.isArray(data.groceryList) && data.groceryList.length > 0 && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="grocery">
            <AccordionTrigger className="text-xl font-semibold cursor-pointer">
              🛒 Grocery List
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc ml-6 space-y-1">
                {data.groceryList.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Tips */}
      {Array.isArray(data.dietTips) && data.dietTips.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>💡 Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-6 space-y-1">
              {data.dietTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      {data.disclaimer && (
        <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
          ⚠️ {data.disclaimer}
        </p>
      )}
    </div>
  );
}
