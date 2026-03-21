import SiteContent from "../models/SiteContent.js";

const defaultContent = {
  hero: {
    heading: "Unlock Your Next Great Opportunity",
    subtitle: "Search. Apply. Grow. Your journey starts now.",
  },
  whyChooseUs: [
    { number: "1", title: "Secured & Trusted", description: "All employers are verified. Your data and applications are protected with strong security." },
    { number: "2", title: "Quick Apply", description: "Apply to multiple job openings with a single click — fast and smart hiring process." },
    { number: "3", title: "Skill-Based Matching", description: "We match candidates to roles based on skills and experience — no complex eligibility guesswork." },
    { number: "4", title: "Career Growth", description: "Work with top U.S. companies and start building your professional journey with confidence." },
  ],
  footer: {
    email: "support@opentoowork.com",
    companyName: "OPEN TO WORK",
    tagline: "We connect professionals with opportunities.",
    poweredBy: "Tesnik LLC",
  },
};

// GET site content
export const getSiteContent = async (req, res) => {
  try {
    const record = await SiteContent.findOne({ where: { key: "main" } });

    if (!record) {
      return res.json({ content: defaultContent });
    }

    res.json({ content: JSON.parse(record.value) });
  } catch (err) {
    console.error("Get site content error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// SAVE site content
export const saveSiteContent = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) return res.status(400).json({ message: "Content required" });

    const [record, created] = await SiteContent.findOrCreate({
      where: { key: "main" },
      defaults: { value: JSON.stringify(content) },
    });

    if (!created) {
      await record.update({ value: JSON.stringify(content) });
    }

    res.json({ message: "Site content saved successfully ✅", content });
  } catch (err) {
    console.error("Save site content error:", err);
    res.status(500).json({ message: "Server error" });
  }
};