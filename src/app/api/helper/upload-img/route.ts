import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary only if keys are present
let isCloudinaryConfigured = false;
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  isCloudinaryConfigured = true;
}

export async function POST(req: NextRequest) {
  try {
    const request = await req.formData();
    const file = request.get("file");
    let name = request.get("name") as string;
    if (name) {
      name = name.split(" ").join("_");
    } else {
      name = `upload_${Date.now()}`;
    }
    const folderName = request.get("folderName") || "general";

    if (file instanceof Blob) {
      const fileBuffer = Buffer.from(await file.arrayBuffer());

      // If Cloudinary is configured, upload the file via stream
      if (isCloudinaryConfigured) {
        try {
          const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: `opportune/${folderName}`,
                public_id: name,
                resource_type: "auto",
              },
              (error: any, result: any) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            uploadStream.end(fileBuffer);
          });

          const secureUrl = (uploadResult as any).secure_url;
          return NextResponse.json({ success: true, path: secureUrl });
        } catch (cloudinaryError) {
          console.error("Cloudinary upload failed, falling back to Base64:", cloudinaryError);
        }
      }

      // Default/Fallback: Convert to Base64 Data URL
      const base64Data = fileBuffer.toString("base64");
      const mimeType = file.type || "image/jpeg";
      const imagePath = `data:${mimeType};base64,${base64Data}`;

      return NextResponse.json({ success: true, path: imagePath });
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid file" },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error("Upload handler error:", error);
    return NextResponse.json(
      { success: false, error: "Unknown error occurred during upload." },
      { status: 500 }
    );
  }
}
