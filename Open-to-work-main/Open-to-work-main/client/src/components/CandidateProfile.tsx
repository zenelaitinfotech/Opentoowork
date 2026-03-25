import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";



const API = "https://job-portal-backend.onrender.com";

const CandidateProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);

  /* ================= FETCH PROFILE ================= */
  const fetchProfile = async () => {
    const res = await fetch(`${API}/api/candidate/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    console.log("FRONTEND RECEIVED:", JSON.stringify(data));
    setProfile(data);
  };

  useEffect(() => {
    fetchProfile();
  }, []);


  

  const handleUpdate = async () => {
  try {
    if (!profile) return;

    // Prepare data exactly as backend expects
    const updatedData = {
      full_name: profile.full_name,
      about: profile.about,
      skills: profile.skills,
      location: profile.location,
      socialLinks: profile.socialLinks || { github: "", linkedin: "" },
    };

    console.log("Sending data:", updatedData);

    const res = await fetch(`${API}/api/candidate/update-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    const data = await res.json();
    console.log("Response:", data);

     if (res.ok) {
  toast({ title: "Profile Updated ✅" });
  setEditMode(false);

  // Navigate to dashboard and tell it to refetch profile
  navigate("/candidate/dashboard", { state: { updated: true } });
}else {
      toast({ title: data.message || "Update failed ❌", variant: "destructive" });
      console.error("Error:", data);
    }
  } catch (error: any) {
    console.error("Fetch error:", error);
    toast({ title: "Something went wrong ❌", variant: "destructive" });
  }
};
  /* ================= RESUME UPLOAD ================= */
  const handleResumeUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    const res = await fetch(`${API}/api/candidate/upload-resume`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      setProfile({ ...profile, resume: data.resume });
      toast({ title: "Resume Uploaded 📄" });
    }
  };

  if (!profile) return <div className="p-8">Loading...</div>;

  return (
    <div className="container mx-auto px-6 py-8 grid lg:grid-cols-3 gap-6">
      {/* ================= LEFT SIDE ================= */}
      <div className="space-y-6">
        {/* PROFILE CARD */}
        <Card className="p-6 text-center space-y-3">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
            {profile.full_name?.charAt(0)}
          </div>

          {editMode ? (
            <Input
              value={profile.full_name}
              onChange={(e) =>
                setProfile({ ...profile, full_name: e.target.value })
              }
            />
          ) : (
            <h2 className="text-xl font-bold">{profile.full_name}</h2>
          )}

          <p className="text-black">Open to Work</p>

          <p className="text-sm black">
            📍 {profile.location || "Add location"}
          </p>

          <Button onClick={() => setEditMode(!editMode)}>
            {editMode ? "Cancel" : "Edit Profile"}
          </Button>

          {editMode && (
            <Button onClick={handleUpdate} className="w-full">
              Save Changes
            </Button>
          )}
        </Card>

        {/* ABOUT */}
        <Card className="p-6 space-y-3">
          <h3 className="font-semibold">About Me</h3>

          {editMode ? (
            <Textarea
              value={profile.about || ""}
              onChange={(e) =>
                setProfile({ ...profile, about: e.target.value })
              }
            />
          ) : (
            <p className="text-muted-foreground">
              {profile.about ||
                "Add a summary to tell employers about yourself."}
            </p>
          )}
        </Card>

        {/* SKILLS */}
        <Card className="p-6 space-y-3">
          <h3 className="font-semibold">Skills</h3>

          {editMode ? (
            <Input
              placeholder="Comma separated skills"
              value={profile.skills?.join(", ") || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  skills: e.target.value.split(",").map((s) => s.trim()),
                })
              }
            />
          ) : profile.skills?.length ? (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill: string, i: number) => (
                <Badge key={i}>{skill}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No skills added yet.</p>
          )}
        </Card>

        {/* SOCIAL LINKS */}
        <Card className="p-6 space-y-3">
          <h3 className="font-semibold">Social Links</h3>

          {editMode ? (
            <>
              <Input
                placeholder="LinkedIn URL"
                value={profile.socialLinks?.linkedin || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    socialLinks: {
                      ...profile.socialLinks,
                      linkedin: e.target.value,
                    },
                  })
                }
              />

              <Input
                placeholder="GitHub URL"
                value={profile.socialLinks?.github || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    socialLinks: {
                      ...profile.socialLinks,
                      github: e.target.value,
                    },
                  })
                }
              />
            </>
          ) : (
            <>
              {profile.socialLinks?.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 block"
                >
                  LinkedIn
                </a>
              )}

              {profile.socialLinks?.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 block"
                >
                  GitHub
                </a>
              )}

              {!profile.socialLinks && (
                <p className="text-muted-foreground">No links added.</p>
              )}
            </>
          )}
        </Card>

        {/* ================= RESUME ================= */}
        <Card className="p-6 space-y-3">
          <h3 className="font-semibold">Resume</h3>

          {profile.resume ? (
            <Button asChild>
              <a
                href={`${API}/${profile.resume}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Resume (PDF)
              </a>
            </Button>
          ) : (
            <p className="text-muted-foreground">
              No resume uploaded.
            </p>
          )}

          {editMode && (
            <Input
              type="file"
              accept="application/pdf"
              onChange={handleResumeUpload}
            />
          )}
        </Card>
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="lg:col-span-2 space-y-6">
        {/* EXPERIENCE */}
        <Card className="p-6 space-y-3">
          <h3 className="font-semibold">Experience</h3>

          {profile.experience?.length ? (
            profile.experience.map((exp: any, i: number) => (
              <div key={i}>
                <h4 className="font-medium">{exp.role}</h4>
                <p className="text-sm text-muted-foreground">
                  {exp.company} • {exp.year}
                </p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">
              No experience added yet.
            </p>
          )}
        </Card>

        {/* EDUCATION */}
        <Card className="p-6 space-y-3">
          <h3 className="font-semibold">Education</h3>

          {profile.education?.length ? (
            profile.education.map((edu: any, i: number) => (
              <div key={i}>
                <h4 className="font-medium">{edu.degree}</h4>
                <p className="text-sm text-muted-foreground">
                  {edu.institution} • {edu.year}
                </p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">
              No education listed.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CandidateProfile;