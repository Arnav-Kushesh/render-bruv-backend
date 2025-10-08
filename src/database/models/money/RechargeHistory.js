import mongoose from "mongoose";
import mainMongooseInstance from "../../mongoConfig.js";

var ObjectId = mongoose.mongo.ObjectId;

let rechargeHistory = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      required: true,
    },
    transactionId: String, //id provided by payment facilitator
    paymentFacilitator: {
      type: String,
      enum: ["DODO_PAYMENT", "STRIPE", "RAZORPAY"],
    },
    note: String,
    amountInCents: Number, //amount in cents
  },
  { timestamps: true }
);

rechargeHistory.index({
  userId: 1,
  createdAt: -1,
});

rechargeHistory.index({
  createdAt: -1,
});

export default mainMongooseInstance.model("recharge_history", rechargeHistory);
