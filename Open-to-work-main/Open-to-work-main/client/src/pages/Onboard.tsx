import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
const Onboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
        <Navbar />
    <div className="min-h-screen flex flex-col items-center mt-10">
        
      <h1 className="text-5xl text-blue-600 font- font-extrabold  mb-4">
        Get Started with Open Too Work
      </h1>

      <p className="mb-10 text-gray-600">
        Choose how you want to engage with our platform
      </p>

      <div className="flex gap-10 mx-40">
        {/* Candidate */}
        <div className="p-8 border rounded-lg text-center">
          <h2 className="text-xl font-bold mb-4">
            For Candidates
          </h2>
          <p className="text-lg font-normal mb-4">Create your profile, explore amazing job opportunities, and take the next step in your career.</p>

          <button
            onClick={() => navigate("/candidate/auth")}
            className="bg-blue-500 text-white px-6 py-2 rounded"
          >
            Continue as Candidate
          </button>
        </div>

        {/* Employer */}
        <div className="p-8 border rounded-lg text-center">
          <h2 className="text-xl font-bold mb-4">
            For Recruiter
          </h2>
          <p className="text-lg font-normal mb-4">Post job openings, discover top talent, and build your winning team with ease.</p>

          <button
            onClick={() => navigate("/employer/auth")}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Continue as Recruiter
          </button>
        </div>
      </div>
    </div>
  <Footer />
    </div>
  );
};

export default Onboard;