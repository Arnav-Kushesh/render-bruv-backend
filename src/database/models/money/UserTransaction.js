import mongoose from "mongoose";
import mainMongooseInstance from "../../mongoConfig.js";

/*

Recharges are stored in creditTransaction & in RechargeHistory
This is because this table can get really big, & we might have to delete old usage data
In that case we won't like to loose old 

*/

var ObjectId = mongoose.mongo.ObjectId;

let userTransaction = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      required: true,
    },
    podId: String,
    note: String,
    amountInCents: { type: Number, default: 0, required: true }, //amount in cents
    balanceInCents: { type: Number, default: 0 }, //in cents
    type: {
      type: String,
      enum: ["AMOUNT_ADDED", "AMOUNT_DEDUCTED"],
      required: true,
    },
    //
    transactionId: String, //id provided by payment facilitator
    paymentFacilitator: {
      type: String,
      enum: ["DODO_PAYMENT", "STRIPE", "RAZORPAY"],
    },
  },
  { timestamps: true }
);

userTransaction.index({
  userId: 1,
  createdAt: -1,
});

userTransaction.index({
  podId: 1,
  createdAt: -1,
});

userTransaction.index({
  createdAt: -1,
});

export default mainMongooseInstance.model("user_transaction", userTransaction);
