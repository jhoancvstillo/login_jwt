import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import { FullPageLoader } from "./fullPageLoader";



export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, isAuthLoading } = useAuth();
    const location = useLocation();
  
    if (isAuthLoading) {
      return <FullPageLoader />;
    }
  
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  
    return <>{children}</>;
  };