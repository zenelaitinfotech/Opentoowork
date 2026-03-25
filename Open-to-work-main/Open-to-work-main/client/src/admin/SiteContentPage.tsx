import { useSiteContent } from "../contexts/SiteContentContext";
import { useToast } from "@/hooks/use-toast";

const API_URL = "https://job-portal-backend.onrender.com";

const SiteContentPage = () => {
  const { content, setContent } = useSiteContent();
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_URL}/api/site-content`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        toast({ title: "Saved!", description: "Site content updated successfully." });
      } else {
        toast({ title: "Error", description: "Failed to save.", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Server unreachable.", variant: "destructive" });
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "720px", display: "flex", flexDirection: "column", gap: "24px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Site Content Editor</h1>

      {/* ── Hero ── */}
      <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px" }}>
        <h2 style={{ fontWeight: "600", marginBottom: "12px" }}>Hero Section</h2>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ fontSize: "13px", color: "#64748b" }}>Heading</label>
          <input
            style={{ display: "block", width: "100%", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "8px 12px", marginTop: "4px" }}
            value={content.hero.heading}
            onChange={(e) => setContent(prev => ({
              ...prev,
              hero: { ...prev.hero, heading: e.target.value }
            }))}
          />
        </div>
        <div>
          <label style={{ fontSize: "13px", color: "#64748b" }}>Subtitle</label>
          <input
            style={{ display: "block", width: "100%", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "8px 12px", marginTop: "4px" }}
            value={content.hero.subtitle}
            onChange={(e) => setContent(prev => ({
              ...prev,
              hero: { ...prev.hero, subtitle: e.target.value }
            }))}
          />
        </div>
      </div>

      {/* ── Why Choose Us ── */}
      <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px" }}>
        <h2 style={{ fontWeight: "600", marginBottom: "12px" }}>Why Choose Us</h2>
        {content.whyChooseUs.map((card, index) => (
          <div key={card.number} style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #f1f5f9" }}>
            <p style={{ fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>Card {card.number}</p>
            <div style={{ marginBottom: "8px" }}>
              <label style={{ fontSize: "13px", color: "#64748b" }}>Title</label>
              <input
                style={{ display: "block", width: "100%", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "8px 12px", marginTop: "4px" }}
                value={card.title}
                onChange={(e) => {
                  const updated = [...content.whyChooseUs];
                  updated[index] = { ...updated[index], title: e.target.value };
                  setContent(prev => ({ ...prev, whyChooseUs: updated }));
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: "13px", color: "#64748b" }}>Description</label>
              <textarea
                rows={2}
                style={{ display: "block", width: "100%", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "8px 12px", marginTop: "4px", resize: "vertical" }}
                value={card.description}
                onChange={(e) => {
                  const updated = [...content.whyChooseUs];
                  updated[index] = { ...updated[index], description: e.target.value };
                  setContent(prev => ({ ...prev, whyChooseUs: updated }));
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px" }}>
        <h2 style={{ fontWeight: "600", marginBottom: "12px" }}>Footer</h2>
        {[
          { label: "Email", field: "email" },
          { label: "Company Name", field: "companyName" },
          { label: "Tagline", field: "tagline" },
          { label: "Powered By", field: "poweredBy" },
        ].map(({ label, field }) => (
          <div key={field} style={{ marginBottom: "10px" }}>
            <label style={{ fontSize: "13px", color: "#64748b" }}>{label}</label>
            <input
              style={{ display: "block", width: "100%", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "8px 12px", marginTop: "4px" }}
              value={content.footer[field as keyof typeof content.footer]}
              onChange={(e) => setContent(prev => ({
                ...prev,
                footer: { ...prev.footer, [field]: e.target.value }
              }))}
            />
          </div>
        ))}
      </div>

      {/* ── Save Button ── */}
      <button
        onClick={handleSave}
        style={{ backgroundColor: "#0f172a", color: "#fff", padding: "10px 24px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "600", alignSelf: "flex-start" }}
      >
        Save Changes
      </button>
    </div>
  );
};

export default SiteContentPage;