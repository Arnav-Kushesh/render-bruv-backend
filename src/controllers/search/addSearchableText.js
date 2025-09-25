import Content from "../../database/models/Content.js";
import Profile from "../../database/models/Profile.js";
import getSearchableText from "./getSearchableText.js";

export default async function addSearchableText({
  itemId,
  itemType,
  loggedInUser,
}) {
  if (itemType == "PROFILE") {
    let doc = await Profile.findById(itemId);
    let theText = getSearchableText({ profile: doc, loggedInUser });
    doc.searchableText = theText;
    await doc.save();
  } else if (itemType == "CONTENT") {
    let doc = await Content.findById(itemId);
    let theText = getSearchableText({ post: doc, loggedInUser });
    doc.searchableText = theText;
    await doc.save();
  }
}
