import Profile from "../../../database/models/Profile.js";
import checkModeratorAccess from "../../admin/checkModeratorAccess.js";
import handlePagination from "../../utils/handlePagination.js";
import attachFollowStatusToDocs from "../utils/attachFollowStatusToDocs.js";

export default async function getProfiles(req, res, next) {
  let query = {};
  let sortQuery = { followerCount: -1 };

  if (req.query.searchQuery)
    query["$text"] = { $search: req.query.searchQuery };

  if (req.query.hasNewReports) {
    query.hasNewReports = true;
    sortQuery = { pendingReports: -1 };
  }

  if (req.query.topUsersListForAdmin) {
    let hasAccess = await checkModeratorAccess(req);
    if (!hasAccess) return next("Permission Denied");
    sortQuery = { totalMinutesUsed: -1 };
  }

  console.log(query);

  await handlePagination({ req, res, query, Collection: Profile, processData });

  async function processData(items) {
    if (req.user) {
      items = await attachFollowStatusToDocs(items, req.user._id);
    }

    return items;
  }
}
