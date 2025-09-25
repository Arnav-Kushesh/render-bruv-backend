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
      enum: [
        "MODIFY_PROFILE",
        "CREATE_PROFILE",
        "MODIFY_SITE",
        "CREATE_SITE",
        "MODIFY_COMMENT",
        "CREATE_COMMENT",
        "UPLOAD",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

systemActivity.index({
  authorUserId: -1,
  type: -1,
});

export default mainMongooseInstance.model("systemActivity", systemActivity);
