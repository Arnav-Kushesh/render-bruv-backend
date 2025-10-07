import CompanyTransaction from "../../../database/models/money/CompanyTransaction.js";
import checkModeratorAccess from "../../admin/checkModeratorAccess.js";
import attachAuthorToDocs from "../../api/utils/attachAuthorToDocs.js";
import handlePagination from "../../utils/handlePagination.js";

export default async function getCompanyTransactions(req, res, next) {
  if (!req.user) return next("Login Required");

  let hasAccess = await checkModeratorAccess(req);
  if (!hasAccess) return next("Permission Denied");

  try {
    let sortQuery = { createdAt: -1 };

    const filter = {};

    if (req.query.type) {
      filter.type = req.query.type;
    }

    await handlePagination({
      req,
      res,
      Collection: CompanyTransaction,
      query: filter,
      processData,
      sortQuery,
    });
  } catch (err) {
    next(err);
  }

  async function processData(items) {
    items = await attachAuthorToDocs(items, "userId", "user");

    return items;
  }
}
