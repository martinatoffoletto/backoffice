import { Navigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useUser();

  if (loading) {
    return <p className="text-center mt-10">Cargando...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
