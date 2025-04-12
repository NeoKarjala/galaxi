// src/components/LoginForm.tsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loginApi } from "../services/AuthApi";
import { parseJwt } from "../utils/jwtUtils";

const LoginForm = () => {
  const { setToken, setRole } = useAuth();
  const [email, setEmail] = useState("admin@test.com");
  const [user, setUser] = useState("admin");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await loginApi({
        email,
        password: user // Development mode
      });

      const token = response.token;
      const payload = parseJwt(token);
      const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      setToken(token);
      setRole(role);

    } catch (err: any) {
      setError(err.response?.data?.message || "Kirjautuminen epäonnistui");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-8 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Kirjaudu sisään (Dev)</h2>

      <input
        type="email"
        placeholder="Sähköposti"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-3 p-2 border border-gray-300 rounded"
        disabled={isLoading}
        required
      />

      <input
        type="text"
        placeholder="Käyttäjä"
        value={user}
        onChange={(e) => setUser(e.target.value)}
        className="w-full mb-3 p-2 border border-gray-300 rounded"
        disabled={isLoading}
        required
      />

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        disabled={isLoading}
      >
        {isLoading ? "Kirjaudutaan..." : "Kirjaudu"}
      </button>
    </form>
  );
};

export default LoginForm;
