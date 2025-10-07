import mongoose from "mongoose";
import mainMongooseInstance from "../../mongoConfig.js";

var ObjectId = mongoose.mongo.ObjectId;

let companyTransaction = new mongoose.Schema(
  {
    userId: {
      //user responsible for the transaction
      type: ObjectId,
    },
    type: {
      type: String,
      enum: [
        "REVENUE",
        "PROFIT",
        "EXPENSE",
        "PENDING_EXPENSE",
        "EXPENSE_DEPOSIT",
        "PROFIT_WITHDRAWAL",
      ],
    },
    note: String,

    amountInCents: Number, //amount in cents
    //
    withdrawableAmount: Number, // in cents
    pendingExpenses: Number, // in cents
    //
    transactionId: String, //id provided by payment facilitator
    paymentFacilitator: {
      type: String,
      enum: ["DODO_PAYMENT", "STRIPE", "RAZORPAY"],
    },
  },
  { timestamps: true }
);

companyTransaction.index({
  createdAt: -1,
});

export default mainMongooseInstance.model(
  "company_transaction",
  companyTransaction
);
