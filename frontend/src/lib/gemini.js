import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateDietPlan = async (userData) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  

  const prompt = `
You're a professional nutritionist. Generate a personalized Indian diet plan for ${userData.days} days with recipes for each meal of each day based on:


- Age: ${userData.age}
- Gender: ${userData.gender}
- Height: ${userData.height} cm
- Current weight: ${userData.weight} kg
- Target weight: ${userData.targetWeight} kg
- Goal: ${userData.goal}
- Food preference: ${userData.foodPreference}
- Taste preference: ${userData.taste}
- Allergies: ${userData.allergies || "None"}
- Health conditions: ${userData.healthIssues.join(", ") || "None"}

Use the following user profile:

- Age: {{age}}
- Gender: {{gender}}
- Height: {{height}} cm
- Current Weight: {{currentWeight}} kg
- Target Weight: {{targetWeight}} kg
- Health Conditions: {{healthConditions or "None"}}
- Allergies: {{allergies or "None"}}
- Food Preference: {{foodPreference}}
- Taste: {{tastePreference}}

Follow these strict instructions:
1. Use **only the exact keys** shown below 
2. Always fill every section, even if the value is "None" or an empty array.
3. Return a complete JSON, not markdown or text.
4. Instead of a single-day meal plan, generate for ${userData.days} days, keeping structure like "Day 1", "Day 2", ..., each with 5 meals.


Here is the required format:


{
  "userProfile": {
    "age": 0,
    "gender": "",
    "height": "",
    "current_weight": "",
    "target_weight": "",
    "allergies": "",
    "health_conditions": "",
    "food_preference": "",
    "taste_preference": "",
  },
  "dietSummary": {
    "goal": "",
    "description": ""
  },
  "nutritionalTargets": {
    "total_calories": 0,
    "carbohydrates": "",
    "protein": "",
    "fat": ""
  },
  "mealPlan": {
    "Day 1":{
      "breakfast": {
        "name": "",
        "calories": 0,
        "carbs": "",
        "protein": "",
        "fat": ""
      },
      "midMorning": {
        "name": "",
        "calories": 0,
        "carbs": "",
        "protein": "",
        "fat": ""
      },
      "lunch": {
        "name": "",
        "calories": 0,
        "carbs": "",
        "protein": "",
        "fat": ""
      },
      "snack": {
        "name": "",
        "calories": 0,
        "carbs": "",
        "protein": "",
        "fat": ""
      },
      "dinner": {
        "name": "",
        "calories": 0,
        "carbs": "",
        "protein": "",
        "fat": ""
      }
    }
    "Day 2": {
      ...
    }
    ....
    
  },
  "recipes": {
    "": {
      "ingredients": [],
      "instructions": []
    },
    "": {
      "ingredients": [],
      "instructions": []
    }
    ....more recipes in the same format
  },
  "groceryList": [],
  "dietTips": [],
  "disclaimer": ""
}


`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};
