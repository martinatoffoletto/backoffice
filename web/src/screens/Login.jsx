import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/", { replace: true });
    }
  }, [params, navigate]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 text-center">
      <h1 className="text-2xl font-bold mb-2 text-gray-800">Redirigiendo...</h1>
      <p className="text-gray-500">Si no ocurre nada, por favor inicie sesión desde el portal principal.</p>
    </div>
  );
}
