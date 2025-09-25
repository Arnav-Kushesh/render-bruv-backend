import Content from "../../../database/models/Content.js";
import Profile from "../../../database/models/Profile.js";
import Report from "../../../database/models/Report.js";

export default async function postReport(req, res, next) {
  if (!req.user) return next("Login Required");

  let { itemId, itemType, reason, note } = req.body;

  let existingReport = await Report.findOne({
    subjectID: itemId,
    authorUserId: req.user._id,
  });

  if (existingReport) return next("Report already filed");

  if (!reason) return next("Reason is required");

  let item = null;
  let newReport = new Report();
  newReport.authorUserId = req.user._id;
  newReport.subjectID = itemId;
  newReport.reason = reason;
  newReport.note = note;
  newReport.status = "PENDING";

  if (itemType == "PROFILE") {
    item = await Profile.findById(itemId);
    newReport.profileID = itemId;
  } else if (itemType == "CONTENT") {
    item = await Content.findById(itemId);
    newReport.contentID = itemId;
  } else {
    return next("Invalid type");
  }

  await newReport.save();

  item.hasNewReports = true;
  item.lastReportPostedAt = new Date();
  item.pendingReportCount = await Content.countDocuments({
    subjectID: itemId,
    status: "PENDING",
  });
  item.totalReportCount = await Content.countDocuments({
    subjectID: itemId,
  });

  await item.save();

  return res.json({ data: true });
}
