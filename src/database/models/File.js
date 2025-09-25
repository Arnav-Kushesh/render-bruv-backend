import mongoose from "mongoose";
import mainMongooseInstance from "../mongoConfig.js";
import uniqueValidator from "mongoose-unique-validator";

var ObjectId = mongoose.mongo.ObjectId;

let file = new mongoose.Schema(
  {
    authorUserId: {
      type: ObjectId,
      required: true,
    },
    fileName: {
      type: String,
      unique: true,
      required: true,
    },
    actualExtension: {
      type: String,
      required: true,
    },
    size: {
      type: Number, //bytes
    },
  },
  { timestamps: true }
);

file.plugin(uniqueValidator);

file.index({
  fileName: "descending",
});

export default mainMongooseInstance.model("file", file);
