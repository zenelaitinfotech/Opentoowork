import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/config";

const EmployerAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = isLogin
      ? `${API_URL}/api/auth/employer/signin`
      : `${API_URL}/api/auth/employer/signup`;

    const body = isLogin
      ? { email, password }
      : { companyName, location, email, password };

    setLoading(true);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || `Server error: ${res.status}`);
        return;
      }

      // ✅ Save token and employer info
      localStorage.setItem("token", data.token);
     
      navigate("/employer/dashboard");
    } catch (err: any) {
      console.error("Login failed:", err);
      alert("Network error: Could not reach server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 p-4">
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-8">
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            {isLogin ? "Recruiter Login" : "Create Recruiter Account"}
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            {isLogin
              ? "Login to manage your job postings"
              : "Post jobs and hire top talent"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Company Name</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Signup"}
          </button>
        </form>

        {/* Switch Login/Signup */}
        <div className="text-center mt-6">
          <button
            className="text-indigo-600 text-sm hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Don't have an account? Signup"
              : "Already have an account? Login"}
          </button>
        </div>

        {/* Forgot Password */}
        {isLogin && (
          <div className="text-center mt-3">
            <button
              className="text-sm text-gray-500 hover:text-indigo-600"
              onClick={() => navigate("/employer/forgot-password")}
            >
              Forgot Password?
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerAuth;