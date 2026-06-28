import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        "created",
        "updated",
        "completed",
        "reopened",
        "priority_changed",
        "category_changed",
        "status_changed",
        "archived",
        "restored",
        "deleted",
        "notes_updated",
      ],
    },
    field: { type: String, default: null },
    previousValue: { type: mongoose.Schema.Types.Mixed, default: null },
    newValue: { type: mongoose.Schema.Types.Mixed, default: null },
    performedBy: { type: String, default: "you" },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: true }
);

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
    dueDate: { type: Date, default: null },
    notes: {
      type: String,
      default: "",
      maxlength: [4000, "Notes must be at most 4000 characters"],
    },
    isArchived: { type: Boolean, default: false, index: true },
    activity: { type: [activitySchema], default: [] },
  },
  { timestamps: true }
);

taskSchema.index({ createdAt: -1 });
taskSchema.index({ isArchived: 1, createdAt: -1 });

export default mongoose.model("Task", taskSchema);
