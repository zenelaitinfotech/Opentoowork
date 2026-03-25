import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import JobCard from "@/components/JobCard";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import HowItWorks from "@/components/sections/HowItWorks";
import SuccessStories from "@/components/sections/SuccessStories";
import FloatingChat from "@/components/FloatingChat";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import bgImage from "@/assets/hero-boardroom.jpg";
import { Search, MapPin } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";


const API_URL = "https://job-portal-backend.onrender.com";

const Index = () => {
   
    const siteContent = useSiteContent(); // ✅ Now works
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/employer/approved`);
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !searchTerm ||
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.employer?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.employer?.companyName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation =
      !locationFilter ||
      job.location?.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <div
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "70vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Dark overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.45)"
        }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, padding: "0 20px" }}>
          <h1 style={{ color: "white", fontSize: "80px", fontWeight: "900", lineHeight: "1.1",  textShadow: "2px 4px 12px rgba(0,0,0,0.6)," ,  maxWidth: "900px" }}>
  {siteContent.hero.heading}
</h1>

<p style={{ color: "white", fontSize: "20px", marginTop: "16px", opacity: 0.9 }}>
  {siteContent.hero.subtitle}
</p>

          

          {/* Search Box */}
          <div style={{
            marginTop: "40px",
            width:"800px",
            background: "white",
            padding: "24px 32px",
            borderRadius: "16px",
            boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
            display: "flex",
            gap: "15px",
            alignItems: "flex-end",
          }}>
            <div style={{ textAlign: "left" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                Job Title / Keyword
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "10px 14px", width: "260px" }}>
                <Search size={16} color="#9ca3af" />
                <input
                  type="text"
                  placeholder="e.g. Software Engineer"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ outline: "none", border: "none", fontSize: "14px", width: "100%", color: "#374151" }}
                />
              </div>
            </div>

            <div style={{ textAlign: "left" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                Location
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "10px 14px", width: "220px" }}>
                <MapPin size={16} color="#9ca3af" />
                <input
                  type="text"
                  placeholder="City or State"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  style={{ outline: "none", border: "none", fontSize: "14px", width: "100%", color: "#374151" }}
                />
              </div>
            </div>

            <button
              onClick={() => navigate(`/jobs?q=${searchTerm}&location=${locationFilter}`)}
              style={{
                background: "#3b82f6",
                color: "white",
                padding: "12px 32px",
                borderRadius: "10px",
                border: "none",
                fontWeight: "700",
                fontSize: "15px",
                cursor: "pointer",
                height: "44px",
              }}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* <HeroSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        onSearch={fetchJobs}
      /> */}

      <WhyChooseUs />
      <HowItWorks />
      <SuccessStories />

      {/* Jobs Listing */}
      <section className="py-20 bg-gradient-to-b from-background to-primary-light/10">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-2">Latest Opportunities</h2>
            <p className="text-lg text-muted-foreground">
              {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"} available
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-muted-foreground">Loading amazing opportunities...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No jobs found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  company={job.employer?.company_name || "Company"}
                  location={job.location || job.employer?.location || "Location"}
                  salaryMin={job.salary_min}
                  salaryMax={job.salary_max}
                  jobType={job.job_type}
                  workAuthorization={job.work_authorization}
                  skills={job.skills_required}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <FloatingChat />
    </div>
  );
};

export default Index;