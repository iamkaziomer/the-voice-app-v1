import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: "open" },
  priority: { type: String, required: true },
  concernAuthority: { type: String, required: true },
  reporter: { type: String, required: true },
  comments: { type: [String], default: [] },
  images: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  colony: { type: String, required: true },
  pincode: { type: String, required: true },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  createdAt: { type: Date, default: Date.now },
});

// Add 2dsphere index for geospatial queries
issueSchema.index({ location: "2dsphere" });

const Issue = mongoose.model("Issue", issueSchema);
export default Issue;