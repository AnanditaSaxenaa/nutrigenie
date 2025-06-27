import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Zap, Trash2 } from 'lucide-react';

export default function MyPlans() {
  const [plans, setPlans] = useState([]);
  const [expandedPlanId, setExpandedPlanId] = useState(null);

  const BACKEND = import.meta.env.VITE_BACKEND_URL;

  const handleDelete = async (planId) => {
    try {
      const res = await fetch(`${BACKEND}/delete-diet-plan/${planId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Plan deleted");
        setPlans(prev => prev.filter(p => p._id !== planId));
      } else {
        toast.error(data.message || "Failed to delete plan");
      }
    } catch (err) {
      console.error("❌ Error deleting plan:", err);
      toast.error("Server error while deleting");
    }
  };

  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await fetch(`${BACKEND}/my-diet-plans`, {
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setPlans(data);
        }
      } catch (err) {
        console.error("Failed to fetch plans", err);
      }
    }

    fetchPlans();
  }, [BACKEND]);

  const toggleExpand = (id) => {
    setExpandedPlanId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="space-y-6 px-4 py-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">My Published Plans</h1>
        <p className="text-muted-foreground">
          A collection of all your saved and published meal plans.
        </p>
      </div>

      {plans.length > 0 ? (
        <div className="space-y-4">
          {plans.map((plan, i) => (
            <Card key={plan._id || i} className="flex flex-col gap-4 p-6">
              <CardHeader className="p-0 space-y-2">
                <CardTitle className="text-xl">{plan.title}</CardTitle>
                <CardDescription>
                  Published on: {new Date(plan.date).toLocaleDateString()}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0 space-y-3">
                <p className="text-sm italic text-muted-foreground border-l-4 border-primary pl-4 py-2 bg-muted/30 rounded">
                  “{plan.data?.dietSummary?.description || "No description provided."}”
                </p>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="w-4 h-4" />
                  <span>{plan.data?.dietSummary?.goal + " weight" || "No goal"}</span>
                </div>

                {expandedPlanId === (plan._id || i) && plan.data && (
                  <div className="text-sm space-y-3 pt-2 border-t mt-3">
                    <h4 className="font-semibold text-primary">Meal Plan</h4>
                    {Object.entries(plan.data?.mealPlan || {}).map(([day, meals]) => (
                      <div key={day}>
                        <strong>{day}</strong>
                        <ul className="ml-4 list-disc">
                          {Object.entries(meals).map(([mealKey, meal]) => (
                            <li key={mealKey}>
                              {mealKey}: {meal.name} ({meal.calories} kcal)
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    <h4 className="font-semibold text-primary pt-2">Tips</h4>
                    <ul className="ml-4 list-disc">
                      {(plan.data?.dietTips || []).map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-col sm:flex-row gap-2 p-0 pt-4">
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link to={`/my-plans/${plan._id}`}>
                    View Plan
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(plan._id)}>
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle>No Published Plans Yet</CardTitle>
            <CardDescription>
              You haven't saved any meal plans. Go to the Meal Planner to create your first one!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/dashboard">
                <Zap className="mr-2 h-4 w-4" />
                Create a New Plan
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
