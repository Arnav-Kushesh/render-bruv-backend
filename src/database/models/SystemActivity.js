import mongoose from "mongoose";
import mainMongooseInstance from "../mongoConfig.js";

var ObjectId = mongoose.mongo.ObjectId;

let systemActivity = new mongoose.Schema(
  {
    migrationID: String,
    authorUserId: {
      type: ObjectId,
      required: true,
    },
    type: {
      type: String,
      enum: ["UPLOAD"],
      required: true,
    },
  },
  { timestamps: true }
);

systemActivity.index({
  authorUserId: -1,
  type: -1,
});

export default mainMongooseInstance.model("system_activity", systemActivity);
