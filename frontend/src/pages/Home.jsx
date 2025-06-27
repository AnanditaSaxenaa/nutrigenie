import { Outlet, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Leaf, Zap, Target } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import heroImage from "@/assets/pexels-chitokan-2087748.jpg";

// Icons
function CalendarDays() {
  return (
    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function UtensilsCrossed() {
  return (
    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M16 2L13.7 4.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8z" />
      <path d="M15 15L3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15zm0 0 7 7" />
      <path d="m2.1 2.1 6.4 6.4" />
    </svg>
  );
}
function ListChecks() {
  return (
    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M16 2a4 4 0 0 0-4 4v0" />
      <path d="M20.9 10.1a2 2 0 0 0-2.2-2.2L12 14.8l-1.7-1.7a2 2 0 0 0-2.8 0L6 14.8a2 2 0 0 0 0 2.8l1.4 1.4a2 2 0 0 0 2.8 0L12 17.2l4.6 4.6a2 2 0 0 0 2.8 0l1.4-1.4a2 2 0 0 0 0-2.8z" />
      <path d="M10 10H3M10 6H3M10 14H3M10 18H3" />
    </svg>
  );
}
function FeatureCard({ icon, title, description }) {
  return (
    <Card className="text-left">
      <CardHeader className="flex items-center gap-4 pb-2">
        {icon}
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

const Home = () => {
  const isMobile = useIsMobile();

  return (
    <div className="bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <main className="px-4 sm:px-6 py-10 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-6">
          <h1 className={`font-bold text-primary tracking-tight ${isMobile ? "text-4xl" : "text-5xl sm:text-6xl"}`}>
            Eat Smart. Live Strong. 🌱
          </h1>
          <p className="text-base sm:text-lg max-w-2xl text-muted-foreground">
            India’s own AI-powered diet companion. Build your meal plans with regional flavors, manage health goals,
            and get recipes that suit your style—all in one place.
          </p>
        </div>

        {/* WHY SECTION */}
        <div className={`mt-12 ${isMobile ? "flex flex-col gap-6" : "grid grid-cols-2 gap-10 items-center"}`}>
          {!isMobile && (
            <div className="text-left space-y-6">
              <h2 className="text-3xl font-semibold">Why NutriGenie?</h2>
              <ul className="space-y-4 text-muted-foreground text-base">
                <li className="flex items-start gap-3">
                  <Leaf className="h-6 w-6 text-primary mt-1" />
                  <span>Custom meal plans tailored to Indian habits & preferences.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="h-6 w-6 text-primary mt-1" />
                  <span>AI-generated meals with smart, regional ingredient swaps.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Target className="h-6 w-6 text-primary mt-1" />
                  <span>Track goals and stay accountable with ease.</span>
                </li>
              </ul>
            </div>
          )}
          <img
            src={heroImage}
            alt="Healthy Food"
            className="rounded-lg shadow-xl object-cover w-full h-auto max-h-[400px]"
          />

          {isMobile && (
            <div className="text-left space-y-4">
              <h2 className="text-2xl font-semibold">Why NutriGenie?</h2>
              <ul className="space-y-4 text-muted-foreground text-base">
                <li className="flex items-start gap-3">
                  <Leaf className="h-6 w-6 text-primary mt-1" />
                  <span>Custom meal plans tailored to Indian habits & preferences.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="h-6 w-6 text-primary mt-1" />
                  <span>AI-generated meals with smart, regional ingredient swaps.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Target className="h-6 w-6 text-primary mt-1" />
                  <span>Track goals and stay accountable with ease.</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* CTA CARD */}
        <Card className="w-full max-w-md mx-auto mt-12 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Ready to Begin?</CardTitle>
            <CardDescription className="text-center pt-2">
              Start your wellness journey today. One personalized meal plan at a time.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild size="lg">
              <Link to="/dashboard" className="flex items-center">
                Create My Meal Plan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* FEATURES */}
        <section className="mt-16 w-full max-w-5xl mx-auto">
          <h3 className="text-2xl font-semibold mb-8 text-center">What You'll Love</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <FeatureCard icon={<CalendarDays />} title="AI Meal Planner" description="Balanced Indian meal plans for weight loss, gain, or maintenance." />
            <FeatureCard icon={<UtensilsCrossed />} title="Smart Recipes" description="Traditional & modern recipes with regional flavors." />
            <FeatureCard icon={<ListChecks />} title="Grocery Lists" description="Auto-generated, ready-to-shop ingredient lists." />
          </div>
        </section>

        <Outlet />
      </main>
    </div>
  );
};

export default Home;
