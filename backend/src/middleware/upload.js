import multer from "multer";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);
const MAX_FILE_SIZE = 8 * 1024 * 1024;

export const uploadProductImages = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 5 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED.has(file.mimetype)) {
      cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "image"));
      return;
    }
    cb(null, true);
  },
}).fields([
  { name: "image", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

export const collectFiles = (req) => {
  const image = req.files?.image?.[0];
  const images = req.files?.images ?? [];
  return image ? [image, ...images] : images;
};
