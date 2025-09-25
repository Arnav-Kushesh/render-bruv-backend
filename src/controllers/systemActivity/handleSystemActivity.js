import captureActivity from "./captureSystemActivity.js";
import checkAllowActivity from "./checkAllowSystemActivity.js";
import wipeOldActivities from "./wipeOldSystemActivities.js";

export default async function handleSystemActivity({ loggedInUserId, type }) {
  let allowed = await checkAllowActivity({ loggedInUserId, type });

  if (!allowed) return false;

  await wipeOldActivities({ loggedInUserId, type });
  await captureActivity({ loggedInUserId, type });

  return true;
}
