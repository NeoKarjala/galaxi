// TokenMonitor.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const TokenMonitor = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiry = payload.exp * 1000;
      const timeLeft = expiry - Date.now();

      if (timeLeft <= 0) {
        localStorage.removeItem("jwtToken");
        navigate("/login");
      } else {
        const timeout = setTimeout(() => {
          localStorage.removeItem("jwtToken");
          navigate("/login");
        }, timeLeft);

        return () => clearTimeout(timeout); // cleanup
      }
    }
  }, []);

  return null; // ei renderöi mitään
};
