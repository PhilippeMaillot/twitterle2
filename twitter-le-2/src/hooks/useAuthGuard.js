import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuthGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token"); // 🔹 Vérifie si un token est stocké
    if (!token) {
      navigate("/auth"); // 🔹 Redirige vers la page d'authentification si non connecté
    }
  }, [navigate]);
};

export default useAuthGuard;
