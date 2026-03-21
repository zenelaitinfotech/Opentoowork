import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface JobCardProps {
  job: any;
  onApply: () => void;   // Callback when user applies
  onView?: () => void;    // Optional callback for viewing full job
}

const JobCard = ({ job, onApply, onView }: JobCardProps) => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <div className="bg-white shadow-lg rounded-xl p-6 border hover:shadow-xl transition relative">

        {/* ✅ Approval Badge */}
        {job.approved ? (
          <span className="absolute top-3 right-3 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
            Approved ✅
          </span>
        ) : (
          <span className="absolute top-3 right-3 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
            Pending ⏳
          </span>
        )}

        <h2 className="text-xl font-bold mb-2">{job.title}</h2>

        <p className="text-gray-600 font-medium">
          {job.employer?.companyName || "Company Name"}
        </p>

        <p className="text-sm text-gray-500 mt-1">📍 {job.location}</p>
        <p className="text-sm mt-2">💰 ₹{job.salary_min} - ₹{job.salary_max}</p>
        <p className="text-sm mt-1">🕒 {job.job_type}</p>
        <p className="text-sm mt-1">🎓 Experience: {job.experience_level || "Not specified"}</p>

        <div className="mt-3">
          <p className="text-sm font-semibold">Skills:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {job.skills_required?.map((skill: string, index: number) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-3 line-clamp-3">{job.description}</p>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setShowPopup(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex-1"
          >
            Apply Now
          </button>

          {onView && (
            <button
              onClick={onView}
              className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex-1"
            >
              View
            </button>
          )}
        </div>
      </div>

      {/* ✅ Apply Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Apply for {job.title}</h2>

            <p className="text-sm text-gray-600 mb-3">
              Are you sure you want to apply for this job?
            </p>

            <button
              onClick={() => { onApply(); setShowPopup(false); }}
              className="w-full bg-green-600 text-white py-2 rounded mb-2"
            >
              Yes, Apply
            </button>

            <button
              onClick={() => setShowPopup(false)}
              className="w-full bg-gray-400 text-white py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default JobCard;