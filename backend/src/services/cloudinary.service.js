import { cloudinary, hasCloudinary } from "../config/cloudinary.js";
import { ApiError } from "../lib/errors.js";

const buildTransformations = () => ({
  transformation: [
    { width: 1200, height: 1200, crop: "limit" },
    { quality: "auto", fetch_format: "auto" },
  ],
});

export const uploadImage = async (file, folder = "ecommerce/products") => {
  if (!hasCloudinary()) {
    throw new ApiError(
      503,
      "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to backend/.env"
    );
  }
  if (!file) {
    throw ApiError.badRequest("No image file received (field name: image)");
  }

  const buffer = file.buffer ?? file;
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        ...buildTransformations(),
      },
      (error, result) => {
        if (error) {
          reject(new ApiError(502, `Cloudinary upload failed: ${error.message}`));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
};

export const deleteImage = async (publicId) => {
  if (!publicId || !hasCloudinary()) {
    return;
  }
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("[cloudinary] destroy failed", error.message);
  }
};
