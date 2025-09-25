import mongoose from "mongoose";
import mainMongooseInstance from "../mongoConfig.js";
import uniqueValidator from "mongoose-unique-validator";

var ObjectId = mongoose.mongo.ObjectId;

let content = new mongoose.Schema(
  {
    authorUserId: {
      type: ObjectId,
      required: true,
    },

    images: Array,

    title: {
      type: String,
    },
    description: {
      type: String,
    },
    likeCount: {
      type: Number,
    },

    commentCount: {
      type: Number,
    },
    purpose: {
      type: String,
      enum: ["SHARE_ART", "FEATURE_REQUEST", "RAISE_ISSUE", "DISCUSSION"],
    },

    searchableText: String,
    isDeleted: { default: false, type: Boolean },
    //Report & Banning
    hasNewReports: { default: false, type: Boolean },
    pendingReportCount: { type: Number, default: 0 },
    totalReportCount: { type: Number, default: 0 },
    lastReportPostedAt: Date,
    isBanned: { type: Boolean, default: false },
    bannedAt: { type: Date },
  },
  { timestamps: true }
);

content.plugin(uniqueValidator);

content.index({
  purpose: -1,
});

content.index({
  purpose: -1,
  type: -1,
});

content.index({
  type: -1,
});

content.index({
  authorUserId: -1,
});

content.index({
  state: -1,
});

content.index({
  state: -1,
  city: -1,
});

content.index({
  searchableText: "text",
});

export default mainMongooseInstance.model("content", content);
