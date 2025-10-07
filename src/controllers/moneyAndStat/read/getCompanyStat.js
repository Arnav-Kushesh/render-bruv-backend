import CompanyStat from "../../../database/models/money/CompanyStat.js";
import checkModeratorAccess from "../../admin/checkModeratorAccess.js";
import handlePagination from "../../utils/handlePagination.js";

export default async function getCompanyStat(req, res, next) {
  if (!req.user) return next("Login Required");

  let hasAccess = await checkModeratorAccess(req);
  if (!hasAccess) return next("Permission Denied");

  try {
    let sortQuery = { createdAt: -1 };

    const filter = {};

    if (req.query.type) {
      filter.type = req.query.type;
    }

    if (req.query.durationType) {
      filter.durationType = req.query.durationType;
    }

    await handlePagination({
      req,
      res,
      Collection: CompanyStat,
      query: filter,
      sortQuery,
    });
  } catch (err) {
    next(err);
  }
}
