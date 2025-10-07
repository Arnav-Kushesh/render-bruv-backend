import CompanyTransaction from "../../../database/models/money/CompanyTransaction.js";
import checkModeratorAccess from "../../admin/checkModeratorAccess.js";
import addDataToCompanyStat from "../utils/addDataToCompanyStat.js";

export default async function withdrawProfit(req, res, next) {
  if (!req.user) return next("Login Required");

  let hasAccess = await checkModeratorAccess(req, true);
  if (!hasAccess) return next("Permission Denied");

  let userId = req.user._id;

  let { amountInCents } = req.body;

  amountInCents = parseInt(amountInCents);

  if (isNaN(amountInCents)) return next("Invalid Amount: NAN");

  let latestDoc = await CompanyTransaction.findOne().sort({ createdAt: -1 });

  let newDoc = new CompanyTransaction();
  newDoc.type = "PROFIT_WITHDRAWAL";
  newDoc.userId = userId;
  newDoc.amountInCents = amountInCents;
  newDoc.withdrawableAmount = latestDoc.withdrawableAmount - amountInCents;
  newDoc.pendingExpenses = latestDoc.pendingExpenses;
  await newDoc.save();

  await addDataToCompanyStat({
    type: "PROFIT_WITHDRAWAL",
    amount: amountInCents,
  });

  return res.json({ data: true });
}
