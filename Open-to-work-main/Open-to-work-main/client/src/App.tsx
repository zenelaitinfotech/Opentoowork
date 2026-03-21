import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";


import Index from "./pages/Index";
import About from "./pages/About";
import CandidateAuth from "./pages/CandidateAuth";
import EmployerAuth from "./pages/EmployerAuth";
import Dashboard from "./pages/Dashboard";
import JobDetail from "./pages/JobDetail";
import NotFound from "./pages/NotFound";
import FindJobs from "./pages/FindJobs";
import Onboard from "./pages/Onboard";

import CandidateMiniDashboard from "./components/CandidateMiniDashboard";
import CandidateDashboard from "./components/CandidateDashboard";
import CandidateProfile from "./components/CandidateProfile";
import EmployerDashboard from "./components/RecruiterDashboard";
import ResetPassword from "./pages/ResetPassword";
import EmployerForgotPassword from "./pages/EmployerForgotPassword";
import EmployerResetPassword from "./pages/EmployerResetPassword";

import AdminLogin from "./admin/AdminLogin"; // ✅ Admin Page
import AdminDashboard from "./admin/AdminDashboard";
import { SiteContentProvider } from "./contexts/SiteContentContext"; // add this

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
        <SiteContentProvider> 
          <Toaster />
          <Sonner />

          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Index />} />
             <Route path="/onboard" element={<Onboard />} />
            <Route path="/jobs" element={<FindJobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/candidate/auth" element={<CandidateAuth />} />
            <Route path="/employer/auth" element={<EmployerAuth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            <Route path="/candidate/dashboard" element={<CandidateDashboard />}></Route>
             <Route path="/candidate-mini-dashboard" element={<CandidateMiniDashboard />} />
            <Route path="/candidate/profile" element={<CandidateProfile />} />
            <Route path="/employer/dashboard" element={<EmployerDashboard />}></Route>
            <Route path="/reset-password" element={<ResetPassword />}></Route>
            <Route path="/employer/forgot-password" element={<EmployerForgotPassword />} />
            <Route path="/employer/reset-password" element={<EmployerResetPassword />} />
            <Route path="/employer/jobdetials" element={<JobDetail/>}/>
            

            {/* Admin Route */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard/*" element={<AdminDashboard />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
 </SiteContentProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
