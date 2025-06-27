// components/DietPlanPDF.jsx
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: 'Helvetica',
    lineHeight: 1.6,
  },
  section: {
    marginBottom: 18,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textDecoration: 'underline',
  },
  subHeading: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 6,
    marginBottom: 4,
  },
  listItem: {
    marginLeft: 12,
    marginBottom: 2,
  },
  disclaimer: {
    fontSize: 9,
    marginTop: 12,
    color: 'gray',
  },
});

export default function DietPlanPDF({ dietPlan }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Goal Summary */}
        <View style={styles.section}>
          <Text style={styles.heading}>Goal Summary</Text>
          <Text>{dietPlan.dietSummary.description}</Text>
        </View>

        {/* Nutritional Targets */}
        <View style={styles.section}>
          <Text style={styles.heading}>Nutritional Targets</Text>
          <Text style={styles.listItem}>• Calories: {dietPlan.nutritionalTargets.total_calories}</Text>
          <Text style={styles.listItem}>• Carbs: {dietPlan.nutritionalTargets.carbohydrates}</Text>
          <Text style={styles.listItem}>• Protein: {dietPlan.nutritionalTargets.protein}</Text>
          <Text style={styles.listItem}>• Fat: {dietPlan.nutritionalTargets.fat}</Text>
        </View>

        {/* Meal Plan */}
        <View style={styles.section}>
          <Text style={styles.heading}>Meal Plan (7 Days)</Text>
          {Object.entries(dietPlan.mealPlan).map(([day, meals]) => (
            <View key={day} style={{ marginBottom: 8 }}>
              <Text style={styles.subHeading}>{day}</Text>
              {Object.entries(meals).map(([mealKey, meal]) => (
                <Text key={mealKey} style={styles.listItem}>
                  • {mealKey} — {meal.name} ({meal.calories} kcal, {meal.protein} protein, {meal.carbs} carbs, {meal.fat} fat)
                </Text>
              ))}
            </View>
          ))}
        </View>

        {/* Recipes */}
        <View style={styles.section}>
          <Text style={styles.heading}>Recipes</Text>
          {Object.keys(dietPlan.recipes).map((recipe, i) => (
            <Text key={i} style={styles.listItem}>• {recipe}</Text>
          ))}
        </View>

        {/* Grocery List */}
        <View style={styles.section}>
          <Text style={styles.heading}>Grocery List</Text>
          {dietPlan.groceryList.map((item, i) => (
            <Text key={i} style={styles.listItem}>• {item}</Text>
          ))}
        </View>

        {/* Tips */}
        <View style={styles.section}>
          <Text style={styles.heading}>Tips</Text>
          {dietPlan.dietTips.map((tip, i) => (
            <Text key={i} style={styles.listItem}>• {tip}</Text>
          ))}
        </View>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>{dietPlan.disclaimer}</Text>
      </Page>
    </Document>
  );
}
