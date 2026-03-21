import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
  const navigate = useNavigate();
 const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const { data } = await axios.post("http://localhost:5000/api/auth/login", {
      username,
      password,
    });

    localStorage.setItem("token", data.token); // save JWT
    navigate("/admin/dashboard");
  } catch (error: any) {
    alert(error.response?.data?.message || "Login failed");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">  {/* ✅ wrap */}
    <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
  <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
    Admin Login
  </h2>

  <div className="mb-4">
  <label className="block text-gray-700 mb-2">Username</label>
  <input
    type="text"
    placeholder="Username"
    onChange={(e) => setUsername(e.target.value)}
    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
</div>

  <div className="mb-6">
    <label className="block text-gray-700 mb-2">Password</label>
    <input
      type="password"
      placeholder="Password"
      onChange={(e) => setPassword(e.target.value)}
      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  <button
    type="submit"
    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
  >
    Login
  </button>

  <button type="submit" onClick={() => navigate("/")}
  className="text-cyan-500  px-32 underline hover:text-cyan-700 mt-3">back to home</button>
</form>
</div>
  );
};

export default AdminLogin;