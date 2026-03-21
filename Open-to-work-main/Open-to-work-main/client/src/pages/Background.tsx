import bgImage from "@/assets/hero-boardroom.jpg";

export default function Background() {
  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "90vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        position: "relative",
      }}
    >
      {/* Heading */}
      <h1
        style={{
          color: "white",
          fontSize: "100px",
          fontWeight: "900",
          lineHeight: "1.1",
          textShadow: "3px 4px 12px rgba(0,0,0,0.8)",
        }}
      >
        Unlock Your Next <br />
        Great Opportunity
      </h1>

      {/* Subtitle */}
      <p
        style={{
          color: "white",
          fontSize: "20px",
          marginTop: "15px",
          opacity: 0.9,
        }}
      >
        
      </p>

      {/* Search Box */}
      <div
        style={{
          position: "absolute",
          bottom: "30px",
          background: "white",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
          display: "flex",
          gap: "20px",
          alignItems: "center",
        }}
      ><div>
        <label style={{ display: "block", textAlign: "left" }}>
  Job Title / Keyword
</label>
        <input
          type="text"
          placeholder="e.g. Software Engineer"
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            width: "220px",
          }}
        />
        </div>
          <div>
            <label style={{ display: "block", textAlign: "left" }}>
  Location
</label>
        <input
          type="text"
          placeholder="City or State"
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            width: "220px",
          }}
        />
        </div>

        <button
          style={{
            background: "#3b82f6",
            color: "white",
            padding: "12px 28px",
            borderRadius: "10px",
            border: "none",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>
    </div>
  );
}