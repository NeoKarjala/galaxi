import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  email: string;
  username: string;
  role: string; // Rooli
}

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [role, setRole] = useState<string>("user"); // Oletusrooli "user"
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  // Handle registration form submission
  const handleRegister = async () => {
    try {
      const user: User = { email, username, role };

      // Send POST request to backend to register the user
      await axios.post("http://localhost:5141/api/auth/register", user, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // If successful, show success message and redirect to login page
      alert("Registration successful, please log in.");
      navigate("/login"); // Redirect to login page
    } catch (err) {
      setError("Failed to register. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-8 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
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
      <div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mb-3 p-2 border border-gray-300 rounded"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        onClick={handleRegister}
      >
        Register
      </button>
    </div>
  );
};

export default Register;
