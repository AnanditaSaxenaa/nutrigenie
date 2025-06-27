import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RecipePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, ingredients, instructions } = location.state || {};

  if (!name || !ingredients || !instructions) {
    return (
      <div className="p-6 text-center space-y-4">
        <h2 className="text-xl font-semibold text-destructive">No recipe selected.</h2>
        <Button onClick={() => navigate(-1)} variant="outline">
          ⬅ Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 text-[hsl(var(--foreground))]">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2 text-lg">🧂 Ingredients:</h3>
            <ul className="list-disc ml-6 space-y-1">
              {ingredients.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-lg">👩‍🍳 Instructions:</h3>
            <ol className="list-decimal ml-6 space-y-1">
              {instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button onClick={() => navigate(-1)} variant="secondary">
          ⬅ Back to Diet Plan
        </Button>
      </div>
    </div>
  );
}
