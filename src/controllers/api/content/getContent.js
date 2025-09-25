import mongoose from "mongoose";
import Content from "../../../database/models/Content.js";
import attachAuthorToDocs from "../utils/attachAuthorToDocs.js";
import attachLikeStatusToDocs from "../utils/attachLikeStatusToDocs.js";

export default async function getContent(req, res, next) {
  const { itemId } = req.query;

  const isValid = mongoose.Types.ObjectId.isValid(itemId);

  if (!isValid) return next("Invalid objectID");

  const content = await Content.findById(itemId);

  let items = await attachAuthorToDocs([content]);

  if (req.user) {
    items = await attachLikeStatusToDocs(items, req.user._id);
  }

  return res.json({ data: items[0] });
}
