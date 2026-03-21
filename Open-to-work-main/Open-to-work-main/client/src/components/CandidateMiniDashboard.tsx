// components/CandidateMiniDashboard.tsx
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const API_URL = "http://localhost:5000";

const CandidateMiniDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const token = localStorage.getItem("token");

  // Fetch minimal profile info
  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/api/candidate/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setProfile(data);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast({ title: "Logged out successfully!" });
    navigate("/login"); // redirect to login page
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <Card className="p-4 w-64 space-y-4">
      {/* Profile Section */}
      <div
        className="cursor-pointer"
        onClick={() => navigate("/candidate/profile")}
      >
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold">
          {profile.full_name?.charAt(0)}
        </div>
        <h3 className="font-semibold mt-2">{profile.full_name}</h3>
        <p className="text-sm text-muted-foreground">{profile.email}</p>
        <Badge>Candidate</Badge>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => navigate("/candidate/profile")}
        >
          View Profile
        </Button>
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </Card>
  );
};

export default CandidateMiniDashboard;