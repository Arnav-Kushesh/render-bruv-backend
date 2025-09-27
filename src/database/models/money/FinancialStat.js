import mongoose from "mongoose";
import mainMongooseInstance from "../../mongoConfig.js";

var ObjectId = mongoose.mongo.ObjectId;

let companyTransaction = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["REVENUE", "PROFIT", "EXPENSE", "PENDING_EXPENSE"],
    },
    //
    //In case of monthly, it will be first day of the month
    //In case of yearly it will be the first day of the year
    date: String,
    //
    durationType: { type: String, enum: ["DAILY", "MONTHLY", "YEARLY"] },
    amount: Number, //in cents
  },
  { timestamps: true }
);

companyTransaction.index({
  type: -1,
  durationType: -1,
  createdAt: -1,
});

export default mainMongooseInstance.model(
  "companyTransaction",
  companyTransaction
);
