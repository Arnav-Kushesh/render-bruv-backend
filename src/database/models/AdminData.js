import mongoose from "mongoose";
import mainMongooseInstance from "../mongoConfig.js";

let adminData = new mongoose.Schema(
  {
    type: String,
    data: Object,
  },
  { timestamps: true }
);

export default mainMongooseInstance.model("admin_data", adminData);
