import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/config";
import { useToast } from "@/hooks/use-toast";

const EmployerForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!email) {
      toast({ title: "Error", description: "Please enter your email", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/employer/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({ title: "Error", description: data.message || "Failed to send OTP", variant: "destructive" });
        return;
      }

      toast({ title: "Success", description: data.message || "OTP sent to your email" });

      // ✅ Navigate to Reset Password page after OTP is sent
      navigate("/employer/reset-password", { state: { email } });
    } catch (err: any) {
      console.error("OTP error:", err);
      toast({ title: "Error", description: "Network error. Try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
        <p className="text-center text-gray-500 mb-6">
          Enter your registered email to receive a password reset OTP.
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
          />

          <button
            onClick={handleSendOTP}
            disabled={loading}
            className={`w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployerForgotPassword;