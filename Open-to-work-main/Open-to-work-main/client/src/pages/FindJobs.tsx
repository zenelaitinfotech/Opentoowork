import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";
import { Building2, MapPin, DollarSign, Briefcase, Search } from "lucide-react";
import { API_URL } from "@/config";



const FindJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [locationText, setLocationText] = useState("");

  // ✅ Dropdown state
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/employer/approved`);
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();
      const jobsData = data.jobs || [];
      setJobs(jobsData);
      setFilteredJobs(jobsData);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    let filtered = [...jobs];
    if (searchText) {
      filtered = filtered.filter(
        (job) =>
          job.title?.toLowerCase().includes(searchText.toLowerCase()) ||
          job.employer?.companyName?.toLowerCase().includes(searchText.toLowerCase()) ||
          job.employer?.company_name?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (locationText) {
      filtered = filtered.filter((job) =>
        job.location?.toLowerCase().includes(locationText.toLowerCase())
      );
    }
    setFilteredJobs(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchText, locationText]);

  // ✅ Dropdown filtered jobs
  const dropdownJobs = searchText.trim()
    ? jobs.filter(
        (job) =>
          job.title?.toLowerCase().includes(searchText.toLowerCase()) ||
          job.employer?.companyName?.toLowerCase().includes(searchText.toLowerCase()) ||
          job.employer?.company_name?.toLowerCase().includes(searchText.toLowerCase()) ||
          job.location?.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* ===== HEADER ===== */}
      <div className="bg-white border-b border-gray-100 px-6 py-10">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-1">Find Jobs</h1>
          <p className="text-gray-500 mb-6">Discover your next career move</p>

          {/* Search Bar */}
          <div className="flex gap-3">

            {/* ✅ Search with Dropdown */}
            <div className="relative flex-1" ref={dropdownRef}>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Job title, keyword, or company"
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => searchText.trim() && setShowDropdown(true)}
                  className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder-gray-400"
                />
              </div>

              {/* ✅ Dropdown */}
              {showDropdown && searchText.trim() && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-72 overflow-y-auto">
                  {dropdownJobs.length > 0 ? (
                    dropdownJobs.map((job) => (
                      <div
                        key={job.id || job._id}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-0 transition-colors"
                        onClick={() => {
                          setSearchText(job.title);
                          setShowDropdown(false);
                          navigate(`/jobs/${job.id || job._id}`);
                        }}
                      >
                        <Briefcase className="mt-1 h-4 w-4 text-blue-500 shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{job.title}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Building2 className="h-3 w-3" />
                            {job.employer?.company_name || job.employer?.companyName || "Company"}
                            &nbsp;•&nbsp;
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-4 text-sm text-gray-400 text-center">
                      No jobs found for "<span className="font-medium text-gray-600">{searchText}</span>"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Location Input — unchanged */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 flex-1">
              <MapPin className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Location"
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===== JOB CARDS — unchanged ===== */}
      <div className="container mx-auto max-w-5xl px-6 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-400 mt-3 text-sm">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p>No jobs found. Try different keywords.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredJobs.map((job) => {
              const visibleBadges = (job.work_authorization || []).slice(0, 3);
              const extraBadges = (job.work_authorization || []).length - 3;

              return (
                <div
                  key={job.id || job._id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {job.employer?.company_name || job.employer?.companyName || "Company"}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 bg-green-50 text-green-600 text-sm font-medium px-3 py-1.5 rounded-lg mb-3 w-fit">
                        <DollarSign className="w-4 h-4" />
                        ${job.salary_min} - ${job.salary_max} / year
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        {job.job_type}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {visibleBadges.map((badge: string) => (
                          <span key={badge} className="border border-gray-300 text-gray-600 text-xs px-3 py-1 rounded-full">
                            {badge}
                          </span>
                        ))}
                        {extraBadges > 0 && (
                          <span className="border border-gray-300 text-gray-600 text-xs px-3 py-1 rounded-full">
                            +{extraBadges} more
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {job.skills_required?.map((skill: string) => (
                          <span key={skill} className="bg-blue-50 text-blue-500 text-xs px-3 py-1 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="ml-6 mt-1">
                      <button
                        onClick={() => navigate(`/jobs/${job.id || job._id}`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl transition text-sm whitespace-nowrap"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
      <FloatingChat />
    </div>
  );
};

export default FindJobs;