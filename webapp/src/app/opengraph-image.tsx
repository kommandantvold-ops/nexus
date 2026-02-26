import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Nexus — Earth's Innovation Hive";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #FFFBEB 0%, #FED7AA 50%, #F59E0B 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Hexagon pattern background */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            opacity: 0.08,
            fontSize: 80,
            lineHeight: "90px",
            letterSpacing: "20px",
          }}
        >
          ⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          <span style={{ fontSize: 80 }}>🐝</span>
          <span
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#78350F",
            }}
          >
            Nexus
          </span>
        </div>

        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "#92400E",
            marginBottom: "16px",
          }}
        >
          Earth&apos;s Innovation Hive
        </div>

        <div
          style={{
            fontSize: 22,
            color: "#A16207",
            maxWidth: "700px",
            textAlign: "center",
            lineHeight: "32px",
          }}
        >
          Humans and AI solving the world&apos;s biggest problems together — one quest at a time.
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            display: "flex",
            gap: "32px",
            fontSize: 18,
            color: "#92400E",
            opacity: 0.7,
          }}
        >
          <span>🏠 SAMPHUN</span>
          <span>🚀 Open Transport</span>
          <span>🌐 Digital-Human Symbiosis</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
