import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/lib/config/site";

export const runtime = "nodejs";

export const alt = SITE_CONFIG.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2563eb",
        color: "#ffffff",
        fontFamily: "sans-serif",
        padding: "48px",
      }}
    >
      <h1
        style={{
          fontSize: "72px",
          fontWeight: 700,
          letterSpacing: "-0.025em",
          lineHeight: 1.1,
          textAlign: "center",
          margin: 0,
        }}
      >
        {SITE_CONFIG.name}
      </h1>
      <p
        style={{
          fontSize: "28px",
          fontWeight: 400,
          lineHeight: 1.4,
          textAlign: "center",
          margin: "16px 0 0 0",
          opacity: 0.9,
        }}
      >
        {SITE_CONFIG.description}
      </p>
    </div>,
    {
      ...size,
    }
  );
}
