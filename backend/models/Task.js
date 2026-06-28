import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [80, "Title must be at most 80 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, "Description must be at most 300 characters"],
      default: "",
    },
    category: {
      type: String,
      trim: true,
      default: "General",
      maxlength: 40,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

taskSchema.index({ createdAt: -1 });

export default mongoose.model("Task", taskSchema);
