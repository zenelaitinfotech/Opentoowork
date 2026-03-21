import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/config";
import { useToast } from "@/hooks/use-toast";

const EmployerResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleReset = async () => {
    if (!email || !otp || !newPassword) {
      toast({ title: "Error", description: "All fields are required", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/employer/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({ title: "Error", description: data.message || "Failed to reset password", variant: "destructive" });
        return;
      }

      toast({ title: "Success", description: data.message || "Password reset successfully" });

      // Navigate to login page after reset
      navigate("/employer/login");
    } catch (err: any) {
      console.error("Reset password error:", err);
      toast({ title: "Error", description: "Network error. Try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 p-4">
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
        <p className="text-center text-gray-500 mb-6">
          Enter your email, OTP, and new password to reset.
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <input
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
          />

          <button
            onClick={handleReset}
            disabled={loading}
            className={`w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployerResetPassword;