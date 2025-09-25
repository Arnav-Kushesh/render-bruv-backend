import mongoose from "mongoose";
import mainMongooseInstance from "../mongoConfig.js";

var ObjectId = mongoose.mongo.ObjectId;

let serverInstance = new mongoose.Schema(
  {
    authorUserId: {
      type: ObjectId,
      required: true,
    },
    status: { type: String, enum: ["RUNNING", "DELETED"], default: "RUNNING" },
    // There is no off state
    // because sometimes runpod GPU stops working if you restart a stopped instance
    instanceGpuType: { type: String, enum: ["RTX_4090", "GTX_2090"] },
    stoppedAt: Date,
    minuteRan: Number,
    charges: Number, //in cents
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

export default mainMongooseInstance.model("serverInstance", serverInstance);
