import mongoose from "mongoose";
import mainMongooseInstance from "../mongoConfig.js";

var ObjectId = mongoose.mongo.ObjectId;

let report = new mongoose.Schema(
  {
    subjectID: {
      type: ObjectId,
      required: true,
    },
    contentID: {
      type: ObjectId,
    },
    profileID: {
      type: ObjectId,
    },
    authorUserId: {
      type: ObjectId,
      required: true,
    },

    note: String,

    status: {
      type: String,
      enum: ["REVIEWED", "PENDING"],
      default: "PENDING",
    },

    reason: {
      type: String,
      required: true,
      enum: [
        "FRAUDULENT_ACTIVITY",
        "FALSE_INFORMATION",
        "MISLEADING_STORY",
        "FAKE_OR_STOLEN_IMAGES",
        "SPAM_OR_ADVERTISING",
        "HARASSMENT_OR_ABUSE",
        "HATE_SPEECH",
        "INAPPROPRIATE_CONTENT",
        "DUPLICATE_POST",
        "MONEY_LAUNDERING_SUSPECTED",
        "UNVERIFIED_BENEFICIARY",
        "OTHER",
      ],
    },
  },
  { timestamps: true }
);

report.index({
  subjectID: -1,
  createdAt: -1,
});

export default mainMongooseInstance.model("report", report);
