import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/blog";

export const runtime = "nodejs";
export const alt = "補助金申請サポート コラム";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  const title = post?.title || "補助金申請サポート コラム";
  const description = post?.description || "中小企業の補助金申請をAIでサポート";
  const tags = post?.tags?.slice(0, 3) || [];

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #1d4ed8 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "60px 80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.02)",
          }}
        />

        {/* Header: Brand + Label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "auto",
          }}
        >
          <span
            style={{
              fontSize: "22px",
              fontWeight: "600",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            補助金申請サポート
          </span>
          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "100px",
              padding: "8px 20px",
              fontSize: "18px",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            コラム
          </div>
        </div>

        {/* Main content area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
          }}
        >
          {/* Tags */}
          {tags.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginBottom: "24px",
                flexWrap: "wrap",
              }}
            >
              {tags.map((tag) => (
                <div
                  key={tag}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "100px",
                    padding: "6px 16px",
                    fontSize: "18px",
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  #{tag}
                </div>
              ))}
            </div>
          )}

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 30 ? "44px" : "52px",
              fontWeight: "800",
              color: "white",
              lineHeight: "1.2",
              marginBottom: "24px",
              maxWidth: "1000px",
            }}
          >
            {title}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: "24px",
              fontWeight: "400",
              color: "rgba(255,255,255,0.7)",
              lineHeight: "1.5",
              maxWidth: "900px",
              overflow: "hidden",
              display: "-webkit-box",
            }}
          >
            {description.length > 80 ? `${description.slice(0, 80)}...` : description}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "40px",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "12px",
              fontSize: "18px",
            }}
          >
            ✦
          </div>
          <span
            style={{
              fontSize: "18px",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            hojokin.isle-and-roots.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
