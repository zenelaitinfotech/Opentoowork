import { useState, useEffect } from "react";
import { Building2, MapPin, DollarSign, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/config";




export default function LatestOpportunities() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${API_URL}/api/employer/approved`);
        const data = await res.json();

        // ✅ Use all approved jobs, not just last one
        setJobs(data.jobs || []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <p className="text-center py-10">Loading jobs...</p>;
  if (!jobs.length) return <p className="text-center py-10">No jobs found.</p>;

  return (
    <section className="bg-gray-50 min-h-screen px-8 py-10">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold text-gray-900">Latest Opportunities</h2>
        <p className="text-gray-400 text-sm mt-1">{jobs.length} jobs available</p>
      </div>

      <div className="flex flex-col gap-4">
        {jobs.map((job) => {
          const visibleBadges = (job.work_authorization || []).slice(0, 3);
          const extraBadges = (job.work_authorization || []).length - 3;

          return (
            <div
              key={job._id} // ✅ Use _id from backend
              className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-md shadow-sm"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {job.employer?.companyName || "Company"}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-green-50 text-green-600 text-sm font-medium px-4 py-2 rounded-lg mb-4">
                <DollarSign className="w-4 h-4" />
                ${job.salary_min} - ${job.salary_max} / year
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700 mb-4">
                <Briefcase className="w-4 h-4 text-gray-400" />
                {job.job_type}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {visibleBadges.map((badge: string) => (
                  <span
                    key={badge}
                    className="border border-gray-300 text-gray-600 text-xs px-3 py-1 rounded-full"
                  >
                    {badge}
                  </span>
                ))}
                {extraBadges > 0 && (
                  <span className="border border-gray-300 text-gray-600 text-xs px-3 py-1 rounded-full">
                    +{extraBadges} more
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills_required?.map((skill: string) => (
                  <span
                    key={skill}
                    className="bg-blue-50 text-blue-500 text-xs px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <button
                onClick={() => navigate(`/jobs/${job._id}`)} // ✅ Correct _id
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors duration-200"
              >
                View Details
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}