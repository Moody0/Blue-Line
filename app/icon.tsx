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
  // Read official logo PNG from public
  const logoPath = path.join(process.cwd(), "public", "logo.png");
  const logoBuffer = fs.readFileSync(logoPath);
  const base64Logo = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
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
          style={{
            width: "88%",
            height: "88%",
            objectFit: "contain",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
