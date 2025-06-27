// components/ProtectedRoute.jsx
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react"; 
export default function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-muted-foreground">
        <Loader2 className="animate-spin w-6 h-6" />
        <span className="ml-2">Checking authentication...</span>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
