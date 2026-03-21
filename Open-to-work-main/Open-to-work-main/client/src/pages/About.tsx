import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import JobCard from "@/components/JobCard";
import { Link } from "react-router-dom";
import { Briefcase, Mail } from "lucide-react";
import company_log from "../assets/company_log.png"
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function OpenTooWorkLanding() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
   const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedJobs();
  }, []);

  const fetchFeaturedJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/jobs?limit=4"); // your backend endpoint
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();
      setJobs(data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />

      {/* Hero Section */}
      
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl  text-blue-500 font-bold mb-6">About OpenTooWork</h1>
         
        </div>
     

     {/* About Content */}
<section className="py-16">
  <div className="max-w-5xl mx-auto px-6 space-y-8">
    <p className="text-justify text-xl font-semibold">
      We specialize in helping job seekers find the right career opportunities across multiple industries. Our recruitment team works closely with candidates to match them with roles that fit their skills, experience, and goals. Whether you're actively searching for a job or open to new possibilities, we provide personalized support, timely updates, and a seamless hiring process that helps you move forward in your career.
    </p>
    <p className="text-justify text-xl font-semibold">
      We connect talented professionals with meaningful opportunities that support their career goals. Our focus is to make the job search simple, transparent, and rewarding for individuals who are actively looking for their next role.
    </p>
    <p className="text-justify text-xl font-semibold">
      With strong industry knowledge and a people-first approach, we work closely with candidates to understand their experience, strengths, and aspirations. Whether you are starting your career, exploring a new path, or seeking your next big move, we provide the guidance and support needed to reach the right opportunity.
    </p>
  </div>
</section>



      {/* Why Choose Section */}
<h1 className="text-5xl font-bold mb-2 text-center">
  Why Choose OPENTOOWORK?
</h1>
<h5 className="text-lg text-gray-600 mb-2 text-center">
  A platform designed to help skilled talent build a successful career in the United States
</h5>



      <div className="flex justify-center gap-[10px]">
   
<div className="border h-56 w-64 rounded-lg flex flex-col items-center justify-center text-center p-4 transition-transform duration-300 hover:-translate-y-[3px] hover:shadow-lg">
    <p className="text-lg border h-16 w-16 flex  items-center justify-center  text-center rounded-sm font-bold mb-8 bg-blue-500 color-white">
      <span className="text-white">
    1</span>
  </p>
  <span className="text-lg font-bold mb-2">
    Secured & Trusted
  </span>
  <p className="text-sm text-gray-600">
    All employers are verified. Your data and applications are protected with strong security.
  </p>

</div>
  
  <div className="border h-56 w-64 rounded-lg flex flex-col items-center justify-center text-center p-4  transition-transform duration-300 hover:-translate-y-[3px] hover:shadow-lg">
    <p className="text-lg border h-16 w-16 flex  items-center justify-center  text-center rounded-sm font-bold mb-8 bg-blue-500 color-white">
      <span className="text-white">
    2</span>
    </p>
    <span className="text-lg font-bold mb-2">
   Quick Apply
  </span>
    <p className=" text-sm text-gray-600">
       Apply to multiple job openings with a single click — fast and smart hiring process.
    </p>
    
  </div>
  <div className="border h-56 w-64 rounded-sm flex flex-col items-center justify-center text-center p-4  transition-transform duration-300 hover:-translate-y-[3px] hover:shadow-lg">
    <p className="text-lg border h-16 w-16 flex  items-center justify-center  text-center rounded-sm font-bold mb-8 bg-blue-500 color-white">
      <span className="text-white">
    3</span>
    </p>
    
    <span className="text-lg font-bold mb-2">
   Skill-Based Matching
  </span>
    <p className=" text-sm text-gray-600">
       We match candidates to roles based on skills and experience — no complex eligibility guesswork.
    </p>
  </div>

  <div className="border h-56 w-64 rounded-lg flex  flex-col items-center justify-center text-center p-4 transition-transform duration-300 hover:-translate-y-[3px] hover:shadow-lg">
<p className="text-lg border h-16 w-16 flex  items-center justify-center  text-center rounded-sm font-bold mb-8 bg-blue-500 color-white">
      <span className="text-white">
    4</span>
    </p>

    <span className="text-lg font-bold mb-2"> Career Growth </span>
    <p className=" text-sm text-gray-600 ">
       Work with top U.S. companies and start building your professional journey with confidence.
    </p>
  </div>
</div>

      {/* Mission */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-9 text-center">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg text-gray-600">
            We believe every skilled candidate deserves access to opportunities that match their ambitions.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {["Create Your Profile", "Find Jobs", "Apply Easily", "Get Hired"].map(
              (step, index) => (
                <div key={index} className="text-center p-6">
                  <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step}</h3>
                  <p className="text-gray-600 text-sm">
                    {index === 0 && "Sign up and showcase your skills & experience."}
                    {index === 1 && "Search roles that match your goals and location."}
                    {index === 2 && "Apply quickly using your saved profile."}
                    {index === 3 && "Get discovered, track progress, and land the right job."}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>
      
       {/* CTA */}
      
      <section className="bg-primary/5 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl text-black font-bold mb-4">Ready to start your journey?</h2>
          <p className="mb-8 text-lg opacity-95 text-gray-500">
            Join thousands of professionals finding their dream jobs today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 rounded-xl text-white bg-blue-600 font-semibold transition"
            onClick={() => navigate("/Onboard")}>
              Get Started Now
            </button>
            <button className="px-8 py-3 rounded-xl border bg-white text-black border-white font-semibold hover:bg-blue-500 hover:text-black transition"
            onClick={() => navigate("/jobs")}>
              Browse Open Roles
            </button>
          </div>
        </div>
      </section>

     
      
   

      <Footer />
     
    </div>
  );
}