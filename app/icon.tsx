import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

// Image metadata for Next.js App Router
export const size = {
  width: 64,
  height: 64,
};
export const contentType = "image/png";

export default async function Icon() {
  let base64Logo: string | null = null;

  try {
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      base64Logo = `data:image/png;base64,${logoBuffer.toString("base64")}`;
    }
  } catch {
    base64Logo = null;
  }

  return new ImageResponse(
    base64Logo ? (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          backgroundColor: "#ffffff",
          overflow: "hidden",
          border: "2px solid #E2E8F0",
        }}
      >
        <img
          src={base64Logo}
          alt="Blue Line"
          style={{
            width: "88%",
            height: "88%",
            objectFit: "contain",
          }}
        />
      </div>
    ) : (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          backgroundColor: "#0B192C",
          color: "#ffffff",
          fontSize: "24px",
          fontWeight: 900,
          letterSpacing: "-1px",
        }}
      >
        BL
      </div>
    ),
    {
      ...size,
    }
  );
}
