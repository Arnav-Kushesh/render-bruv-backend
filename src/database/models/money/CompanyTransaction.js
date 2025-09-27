import mongoose from "mongoose";
import mainMongooseInstance from "../../mongoConfig.js";

var ObjectId = mongoose.mongo.ObjectId;

let companyTransaction = new mongoose.Schema(
  {
    authorUserId: {
      type: ObjectId,
    },
    type: {
      type: String,
      enum: [
        "REVENUE",
        "PROFIT",
        "EXPENSE",
        "PENDING_EXPENSE",
        "PROFIT_WITHDRAWN",
      ],
    },
    note: String,
    amountDeducted: Number, //amount in cents
    amountAdded: Number, //amount in cents
    //
    withdrawableAmount: Number, // in cents
    pendingExpense: Number, // in cents
    //
  },
  { timestamps: true }
);

companyTransaction.index({
  createdAt: -1,
});

export default mainMongooseInstance.model(
  "companyTransaction",
  companyTransaction
);
