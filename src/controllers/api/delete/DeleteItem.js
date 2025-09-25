import Content from "../../../database/models/Content.js";
import Notification from "../../../database/models/Notification.js";

export default async function deleteItem(req, res, next) {
  if (!req.user) return next("Permission Denied");

  let { itemId, itemType } = req.body;

  if (itemType == "CONTENT") {
    let item = await Content.findById(itemId);

    if (!item) return next("Item not found");
    if (item.authorUserId.toString() !== req.user._id.toString())
      return next("Permission Denied");

    item.isDeleted = true;
    //we just mark them as deleted and don't actually delete them
    //because the info might be useful for fraud investigation

    await item.save();
  } else if (itemType == "COMMENT") {
    let item = await Notification.findById(itemId);

    if (!item) return next("Item not found");

    if (
      item.senderUserId.toString() !== req.user._id.toString() &&
      item.receiverUserId.toString() !== req.user._id.toString()
    )
      return next("Permission Denied");

    item.isDeleted = true;

    await item.save();
  } else {
    return next("Invalid item type");
  }

  return res.json({ data: true });
}
