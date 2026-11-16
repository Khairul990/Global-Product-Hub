import { NextRequest, NextResponse } from "next/server";
import { getServerAdminUser } from "@/lib/auth/server";
import { adminStorage } from "@/lib/firebase/admin";

export async function POST(request: NextRequest) {
  try {
    const user = await getServerAdminUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files (JPEG, PNG, WebP) are allowed." }, { status: 400 });
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Image size must be less than 5MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `products/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    // Upload to Firebase Storage if available
    if (adminStorage) {
      try {
        const bucket = adminStorage.bucket();
        const fileRef = bucket.file(fileName);
        await fileRef.save(buffer, {
          contentType: file.type,
          metadata: {
            cacheControl: "public, max-age=31536000",
          },
        });
        await fileRef.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        return NextResponse.json({ success: true, url: publicUrl });
      } catch (e) {
        console.warn("Storage upload error; falling back to data URL:", e);
      }
    }

    // Fallback: Base64 data URL
    const base64Data = `data:${file.type};base64,${buffer.toString("base64")}`;
    return NextResponse.json({ success: true, url: base64Data });
  } catch (error: any) {
    console.error("Upload handler error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload image" }, { status: 500 });
  }
}
