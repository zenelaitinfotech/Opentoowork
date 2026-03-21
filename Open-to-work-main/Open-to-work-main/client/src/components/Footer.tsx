import { Link } from "react-router-dom";
import { Briefcase, Facebook, Linkedin, Twitter, Instagram } from "lucide-react";
import company_log from "../assets/company_log.png"
import { Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-primary/5 to-accent/5 border-t border-border/50 py-12">
      <div className="container mx-auto px-4 ">
        <div className="grid md:grid-cols-3 gap-5 mb-8 ">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                OPEN TO WORK
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              We connect professionals with opportunities.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex justify-center">
            <div className="w-36">
            <h4 className="font-semibold text-foreground mb-4">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  About Us
                </Link>
              </li>
              
              <li>
                <Link to="/candidate/auth" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  For Candidate
                </Link>
              </li>
              <li>
                <Link to="/employer/auth" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  For Recruiter
                </Link>
              </li>
               <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  For Bench
                </Link>
              </li>
            </ul>
          </div>
          </div>
            <div className=" flex justify-center">
              <div className="w-36">
              <h3 className="text-base font-semibold mb-3">Contact</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
             <span>support@opentoowork.com</span>
           </div>
           </div>
          </div>
        </div>

        

        {/* Copyright */}
       
        <div className="flex justify-end items-center text-xl mb-6 font-bold text-primary ">
  Powered by Tesnik LLC
</div>
        

        <div className="bg-blue-500 p-10 w-full">
          <div className="flex items-center justify-start gap-3 mb-4 pr-4">
            <span className="text-sm text  text font-bold to-black"> Developed by</span> 
            <img src={company_log} alt="" className="h-10 flex item-right" style={{ backgroundColor: "white"   }}/></div>
          <p className="text-sm font-bold text-black text-center">
            © {new Date().getFullYear()}  OPEN TO WORK. All rights reserved.
          </p>
          </div>
        </div>
        
      
    </footer>
  );
};

export default Footer;
