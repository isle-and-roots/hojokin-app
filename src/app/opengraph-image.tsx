import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "補助金申請サポート | AIで申請書類を自動生成";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #1d4ed8 100%)",
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
        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 60%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
          }}
        />

        {/* Logo/Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "16px",
              fontSize: "28px",
            }}
          >
            ✦
          </div>
          <span
            style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "rgba(255,255,255,0.9)",
              letterSpacing: "0.05em",
            }}
          >
            ISLE &amp; ROOTS
          </span>
        </div>

        {/* Main Title */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: "800",
            color: "white",
            textAlign: "center",
            lineHeight: "1.1",
            marginBottom: "20px",
            maxWidth: "900px",
          }}
        >
          補助金申請サポート
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "32px",
            fontWeight: "400",
            color: "rgba(255,255,255,0.8)",
            textAlign: "center",
            marginBottom: "48px",
            maxWidth: "800px",
          }}
        >
          AIで申請書類を自動生成
        </div>

        {/* Feature Pills */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {["持続化補助金", "IT導入補助金", "ものづくり補助金"].map((text) => (
            <div
              key={text}
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "100px",
                padding: "10px 24px",
                fontSize: "22px",
                color: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(10px)",
              }}
            >
              {text}
            </div>
          ))}
        </div>

        {/* Bottom tag */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            right: "48px",
            fontSize: "18px",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          hojokin.isle-and-roots.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
