import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface User {
  email: string;
  username: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("user@example.com");
  const [username, setUsername] = useState<string>("string");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  // Handle login form submission
  const handleLogin = async () => {
    try {
      const user: User = { email, username };

      // Make a POST request to the backend to authenticate and get the JWT token
      const response = await axios.post(
        "http://localhost:5141/api/auth/login",
        user,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // If the response is successful, the JWT token is in the response data
      const token = response.data.token;
      console.log("JWT Token:", token);
      console.log("UserData:", user);

      // Optionally, you can store the token in localStorage or a state management library like Redux
      localStorage.setItem("jwtToken", token);

      navigate("/"); // Tämä vie käyttäjän pääsivulle
    } catch {
      // If there's an error (e.g., invalid email)
      setError("Failed to login. Please check your email.");
      console.error();
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-8 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <div>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-3 p-2 border border-gray-300 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        onClick={handleLogin}
      >
        Login
      </button>
      <div className="mt-4 text-center">
        <p>
          Don't have an account?{" "}
          <button
            className="text-blue-600"
            onClick={() => navigate("/register")}
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
