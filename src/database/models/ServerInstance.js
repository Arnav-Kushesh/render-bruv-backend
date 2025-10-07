import mongoose from "mongoose";
import mainMongooseInstance from "../mongoConfig.js";

var ObjectId = mongoose.mongo.ObjectId;

let serverInstance = new mongoose.Schema(
  {
    authorUserId: {
      type: ObjectId,
      required: true,
    },
    projectName: String,
    podId: String,
    status: {
      type: String,
      enum: ["RUNNING", "TERMINATED"],
      default: "RUNNING",
    },
    // There is no off state
    // because sometimes runpod GPU stops working if you restart a stopped instance
    instanceGpuType: {
      type: String,
      enum: [
        "RTX_5090",
        "RTX_6000_ADA",
        "RTX_4090",
        "RTX_3090",
        "RTX_A6000",
        "RTX_A5000",
      ],
    },
    stoppedAt: Date,
    startedAt: Date,
    costEstimatedAtTermination: { type: Number, default: 0 },
    minuteRan: { type: Number, default: 0 },
    charges: { type: Number, default: 0 }, //in cents //Incremented every minute
  },
  { timestamps: true }
);

serverInstance.index({
  authorUserId: 1,
  status: 1,
  createdAt: -1,
});

serverInstance.index({
  authorUserId: 1,
  createdAt: -1,
});

serverInstance.index({
  createdAt: -1,
});

export default mainMongooseInstance.model("server_instance", serverInstance);
