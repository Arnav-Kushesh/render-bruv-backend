import mongoose from "mongoose";
import mainMongooseInstance from "../mongoConfig.js";

var ObjectId = mongoose.mongo.ObjectId;

let complaint = new mongoose.Schema(
  {
    authorUserId: {
      type: ObjectId,
      required: true,
    },

    note: String,
  },
  { timestamps: true }
);

complaint.index({
  createdAt: -1,
});

export default mainMongooseInstance.model("complaint", complaint);
