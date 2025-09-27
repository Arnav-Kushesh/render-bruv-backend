import mongoose from "mongoose";
import mainMongooseInstance from "../../mongoConfig.js";

/*

Recharges are stored in creditTransaction & in RechargeHistory
This is because this table can get really big, & we might have to delete old usage data
In that case we won't like to loose old 

*/

var ObjectId = mongoose.mongo.ObjectId;

let creditTransaction = new mongoose.Schema(
  {
    authorUserId: {
      type: ObjectId,
      required: true,
    },
    podId: String,
    note: String,
    amountAdded: { type: Number, default: 0 }, //amount in cents
    amountDeducted: { type: Number, default: 0 }, //amount in cents
    balance: { type: Number, default: 0 }, //in cents
  },
  { timestamps: true }
);

creditTransaction.index({
  authorUserId: 1,
  createdAt: -1,
});

creditTransaction.index({
  podId: 1,
  createdAt: -1,
});

creditTransaction.index({
  createdAt: -1,
});

export default mainMongooseInstance.model("creditUsage", creditUsage);
