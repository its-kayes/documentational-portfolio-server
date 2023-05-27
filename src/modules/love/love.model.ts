import { Schema, model } from "mongoose";
import { ILove } from "./love.interface";

const lovedSchema = new Schema<ILove>(
  {
    ipAddress: {
      type: String,
    },
    type: {
      type: String,
      required: [true, "Type is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    lovedAt: {
      type: Date,
      required: [true, "Loved at is required"],
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Love = model<ILove>("love", lovedSchema);
