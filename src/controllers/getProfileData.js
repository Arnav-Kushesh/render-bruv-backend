import Profile from "../../database/models/Profile.js";
import Notification from "../../database/models/Notification.js";
export default async function getProfileData(username, loggedInUser) {
  // let commonFields = `_id karma followingCount followerCount`;
  // let selectFields = `username name tagline about image template ${commonFields}`;

  let profile = await Profile.findOne({ username: username });
  if (!profile) return null;

  let profileID = profile._id.toString();

  let followStatus = "NEGATIVE";
  profile._id = profile._id.toString();

  profile = JSON.parse(JSON.stringify(profile));
  if (loggedInUser) {
    let followType = "FOLLOW";
    let followData = await Notification.findOne({
      senderID: loggedInUser._id,
      type: followType,
      subjectId: profileID,
    });

    if (followData) {
      followStatus = followData.status;
    }
  }

  profile.followStatus = followStatus;

  return profile;
}

/*

  Why  store followingCount count in doc?
  * we will need to add additional index for senderID field
  * keeping track of followingCount is easy

  why not store likesReceived count in doc?
  * we have index for receiverID
  * storing this value will be complicated

  why not store articleCount count in doc?
  * we have index for authorID  
  * storing this value will be complicated

  
  Why are we storing count value in document iteself but not always?
  * count is almost like making a full fletched find query with no limit
  * count is expensive
  * storng count in doc makes read faster at the expense of write operation
  * which is fair as reads happen more often than writes
  * this also circumvents the need for additional indexes
  * but sometimes it is too complicated to keep track of count like in
    * likes count
    * article count
    * draft count
  * so in complicated cases it is not ideal to store count value        

*/
