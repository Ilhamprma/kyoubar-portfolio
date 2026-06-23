import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Helper to get absolute path
const getFilePath = (fileName: string) => {
  return path.join(process.cwd(), "content", fileName);
};

export async function GET() {
  try {
    const videos = JSON.parse(fs.readFileSync(getFilePath("videos.json"), "utf8"));
    const pricing = JSON.parse(fs.readFileSync(getFilePath("pricing.json"), "utf8"));
    const testimonials = JSON.parse(fs.readFileSync(getFilePath("testimonials.json"), "utf8"));

    return NextResponse.json({
      videos: videos.items || [],
      pricing: pricing.items || [],
      testimonials: testimonials.items || [],
    });
  } catch (error) {
    console.error("GET content error:", error);
    return NextResponse.json({ error: "Failed to load content files." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!["videos", "pricing", "testimonials"].includes(type)) {
      return NextResponse.json({ error: "Invalid content type." }, { status: 400 });
    }

    const fileName = `${type}.json`;
    const filePath = getFilePath(fileName);

    // Save as structured object with "items" field matching the schema
    const fileContent = JSON.stringify({ items: data }, null, 2);
    fs.writeFileSync(filePath, fileContent, "utf8");

    return NextResponse.json({ success: true, message: `Successfully updated ${type}.` });
  } catch (error) {
    console.error("POST content error:", error);
    return NextResponse.json({ error: "Failed to save content updates." }, { status: 500 });
  }
}
