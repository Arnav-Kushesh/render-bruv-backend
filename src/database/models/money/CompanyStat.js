import mongoose from "mongoose";
import mainMongooseInstance from "../../mongoConfig.js";

var ObjectId = mongoose.mongo.ObjectId;

let companyStat = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "REVENUE",
        "PROFIT",
        "PROFIT_WITHDRAWAL",
        "PENDING_EXPENSE",
        "EXPENSE_DEPOSIT",
        "SIGNUP",
        "INSTANCE_CREATION",
        "INSTANCE_TERMINATION",
      ],
    },
    //
    //In case of monthly, it will be first day of the month
    //In case of yearly it will be the first day of the year
    date: String, //ISO 8601 format YYYY-MM-DD
    // I am not using DD/MM/YYYY or MM/DD/YYYY because it can be ambiguous
    // If date is first or month is first

    durationType: { type: String, enum: ["DATE", "MONTH", "YEAR"] },
    amount: { type: Number, default: 0 }, //in cents
  },
  { timestamps: true }
);

/*
  Why I have stored data, DATE, MONTH & YEAR wise
  even though I can get yearly and monthly data
  simply by analyzing date docs.

  Ans -> Because if we decide to extract monthly and yearly data 
  only from date wise data, it will requires us to loop
  over too many date docs
*/

companyStat.index({
  type: -1,
  durationType: -1,
  createdAt: -1,
});

export default mainMongooseInstance.model("company_stat", companyStat);
