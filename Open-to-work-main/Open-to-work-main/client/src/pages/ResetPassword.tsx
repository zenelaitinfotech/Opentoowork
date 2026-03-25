import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Error",
        description: "Email missing",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://job-portal-backend.onrender.com/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast({ title: "Password Updated Successfully" });

      navigate("/candidate/auth");

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-6 text-center">
          Enter OTP & New Password
        </h2>

        <form onSubmit={handleReset} className="space-y-4">

          <Input
            type="text"
            placeholder="Enter OTP"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <Input
            type="password"
            placeholder="New Password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating..." : "Reset Password"}
          </Button>

        </form>
      </Card>
    </div>
  );
};

export default ResetPassword;