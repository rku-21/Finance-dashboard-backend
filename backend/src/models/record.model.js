import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
    amount: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["income", "expense"],
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Record = mongoose.model("Record", recordSchema);