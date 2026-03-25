import { useState, useEffect } from "react";

const API_URL = "https://job-portal-backend.onrender.com";

const defaultContent = {
  hero: {
    heading: "Unlock Your Next Great Opportunity",
    subtitle: "Search. Apply. Grow. Your journey starts now.",
  },
  whyChooseUs: [
    { number: "1", title: "Secured & Trusted", description: "All employers are verified." },
    { number: "2", title: "Quick Apply", description: "Apply with a single click." },
    { number: "3", title: "Skill-Based Matching", description: "We match based on skills." },
    { number: "4", title: "Career Growth", description: "Work with top U.S. companies." },
  ],
  footer: {
    email: "support@opentoowork.com",
    companyName: "OPEN TO WORK",
    tagline: "We connect professionals with opportunities.",
    poweredBy: "Tesnik LLC",
  },
};

export const useSiteContent = () => {
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    fetch(`${API_URL}/api/site-content`)
      .then((res) => res.json())
      .then((data) => {
        if (data.content) setContent(data.content);
      })
      .catch(() => console.log("Using default content"));
  }, []);

  return content;
};