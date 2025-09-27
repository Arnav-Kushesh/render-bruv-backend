import mongoose from "mongoose";
import mainMongooseInstance from "../../mongoConfig.js";

var ObjectId = mongoose.mongo.ObjectId;

let recharge = new mongoose.Schema(
  {
    authorUserId: {
      type: ObjectId,
      required: true,
    },
    note: String,
    amount: Number, //amount in cents
  },
  { timestamps: true }
);

recharge.index({
  authorUserId: 1,
  createdAt: -1,
});

transaction.index({
  createdAt: -1,
});

export default mainMongooseInstance.model("recharge", recharge);
