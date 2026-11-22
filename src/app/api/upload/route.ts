import { NextResponse } from "next/server";

// Server-side ImgBB upload used by the public Sign Up page.
// The ImgBB API key stays in a private (non NEXT_PUBLIC) environment variable
// and is never sent to the browser.

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function detectImageType(buffer: Buffer): string | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "image/jpeg";
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buffer.length >= 6 && ["GIF87a", "GIF89a"].includes(buffer.toString("ascii", 0, 6))) return "image/gif";
  if (buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  return null;
}

const fail = (message: string, status: number) =>
  NextResponse.json({ success: false, message }, { status });

export async function POST(request: Request) {
  const apiKey = process.env.IMGBB_API_KEY;

  if (!apiKey) {
    return fail("Image upload is not configured on the server.", 500);
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return fail("Invalid upload request.", 400);
  }

  const file = formData.get("image");

  if (!(file instanceof File)) {
    return fail("Please attach an image file.", 400);
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return fail("Only JPG, PNG, WEBP or GIF images are allowed.", 400);
  }

  if (file.size > MAX_FILE_SIZE) {
    return fail("Image must be 5 MB or smaller.", 400);
  }

  const imageBuffer = Buffer.from(await file.arrayBuffer());
  if (detectImageType(imageBuffer) !== file.type) {
    return fail("File contents must match a valid JPG, PNG, WEBP or GIF image.", 400);
  }

  try {
    const body = new FormData();
    body.append("image", imageBuffer.toString("base64"));

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      { method: "POST", body },
    );

    const result = await response.json();
    const url: string | undefined = result?.data?.display_url ?? result?.data?.url;

    if (!response.ok || !result?.success || !url) {
      return fail("Image upload failed. Please try again.", 502);
    }

    return NextResponse.json({ success: true, data: { url } });
  } catch {
    return fail("Image upload failed. Please try again.", 502);
  }
}
