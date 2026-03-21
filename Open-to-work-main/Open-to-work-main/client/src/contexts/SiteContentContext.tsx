// src/contexts/SiteContentContext.tsx
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const API_URL = "http://localhost:5000";

// Types
type HeroContent = { heading: string; subtitle: string };
type WhyChooseUsCard = { number: string; title: string; description: string };
type FooterContent = { email: string; companyName: string; tagline: string; poweredBy: string };

export type SiteContentType = {
  hero: HeroContent;
  whyChooseUs: WhyChooseUsCard[];
  footer: FooterContent;
};

// Default content
const defaultContent: SiteContentType = {
  hero: { heading: "Unlock Your Next Great Opportunity", subtitle: "Search. Apply. Grow. Your journey starts now." },
  whyChooseUs: [
    { number: "1", title: "Secured & Trusted", description: "All employers are verified. Your data and applications are protected with strong security." },
    { number: "2", title: "Quick Apply", description: "Apply to multiple job openings with a single click — fast and smart hiring process." },
    { number: "3", title: "Skill-Based Matching", description: "We match candidates to roles based on skills and experience — no complex eligibility guesswork." },
    { number: "4", title: "Career Growth", description: "Work with top U.S. companies and start building your professional journey with confidence." },
  ],
  footer: { email: "support@opentoowork.com", companyName: "OPEN TO WORK", tagline: "We connect professionals with opportunities.", poweredBy: "Tesnik LLC" },
};

// Context value type
type SiteContentContextType = {
  content: SiteContentType;
  setContent: React.Dispatch<React.SetStateAction<SiteContentType>>;
};

const SiteContentContext = createContext<SiteContentContextType | null>(null);

// Provider
export const SiteContentProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [content, setContent] = useState<SiteContentType>(defaultContent);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${API_URL}/api/site-content`);
        const data = await res.json();
        if (data.content) setContent(data.content);
      } catch (err) {
        console.error("Failed to load site content:", err);
      }
    };
    fetchContent();
  }, []);

  return (
    <SiteContentContext.Provider value={{ content, setContent }}>
      {children}
    </SiteContentContext.Provider>
  );
};

// Custom hook
export const useSiteContent = () => {
  const context = useContext(SiteContentContext);
  if (!context) throw new Error("useSiteContent must be used within SiteContentProvider");
  return context;
};