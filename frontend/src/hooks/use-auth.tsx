import {
  createContext,
  useContext,
  useMemo,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { loginUser } from "@/api/auth";
import { FullPageLoader } from "@/providers/fullPageLoader";

interface User { 
  username: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthContextProps {
  user: User | null;
  isProfileLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthLoading: boolean;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);



export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: user,
    isLoading: isProfileLoading,
    refetch,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await api.get("/profile/");
      return res.data;
    },
    enabled: false, // Deshabilitar auto-carga
    retry: false,
    staleTime: Infinity,
  });

  // Efecto para carga inicial de autenticación
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");
      console.log(token);
      if (token) {
        try {
          await refetch();
        } catch (error) {
          localStorage.removeItem("access_token");
        }
      }
      setIsInitializing(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const data = await loginUser(credentials);
    localStorage.setItem("access_token", data.access);
    await refetch();
    navigate("/");
  };


  const logout = async () => {
    try {
      await api.post('/logout/');
    } catch (error) {
      console.error('Error durante logout:', error);
    } finally {
      localStorage.removeItem('access_token');
      queryClient.removeQueries({ queryKey: ["profile"] });
      navigate("/login");
    }
  };
  

  const value = useMemo(
    () => ({
      user: user || null,
      isProfileLoading,
      isAuthLoading: isInitializing || isProfileLoading,
      login,
      logout,
    }),
    [user, isInitializing, isProfileLoading]
  );

  if (isInitializing) {
    return <FullPageLoader />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  return useContext(AuthContext);
};