import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, lowercase: true, unique: true },
    title: { type: String, trim: true },
  },
  { timestamps: true }
);

export const titleFromSlug = (slug = "") =>
  slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

categorySchema.pre("validate", function setTitle(next) {
  if (!this.title) {
    this.title = titleFromSlug(this.name);
  }
  next();
});

export default mongoose.model("Category", categorySchema);
