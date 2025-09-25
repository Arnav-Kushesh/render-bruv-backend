import mongoose from "mongoose";
import mainMongooseInstance from "../mongoConfig.js";

var ObjectId = mongoose.mongo.ObjectId;

let complaint = new mongoose.Schema(
  {
    authorUserId: {
      type: ObjectId,
      required: true,
    },
    purpose: { type: String, enum: ["RECHARGE", "SERVER_CHARGE"] },
    note: String,
    amountDeducted: Number, //amount in cents
    amountAdded: Number, //amount in cents
    newBalance: Number, // in cents
  },
  { timestamps: true }
);

complaint.index({
  authorUserId: 1,
  purpose: 1,
  createdAt: -1,
});

complaint.index({
  authorUserId: 1,
  createdAt: -1,
});

complaint.index({
  createdAt: -1,
});

export default mainMongooseInstance.model("transaction", transaction);
