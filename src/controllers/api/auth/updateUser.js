import Profile from "../../../database/models/Profile.js";
import addSearchableText from "../../search/addSearchableText.js";
import updateDocument from "../../utils/updateDocument.js";

export default async function updateUser(req, res, next) {
  if (!req.body.changes) return next("Changes do not exists.");
  if (!req.user) return next("Login Required!");

  let loggedInUser = req.user;
  let doc = req.user;
  let changes = req.body.changes;

  let additionalChanges = {};

  if (changes.documentVerification) {
    let prevString = JSON.stringify(loggedInUser.documentVerification);
    let newString = JSON.stringify(changes.documentVerification);

    if (prevString !== newString) {
      additionalChanges.documentVerificationStatus = "PENDING";
      additionalChanges.documentVerificationSubmissionDate = new Date();
    }
  }

  let allowedFields = {
    name: "string",
    dateOfBirth: "string",
    gender: "string",
    username: "string",
    profileImage: "object",
    bio: "string",
    bioOnboardingSkipped: "boolean",
    dateOfBirthOnboardingSkipped: "boolean",
    genderOnboardingSkipped: "boolean",
    signupSource: "string",
    useCase: "string",
  };

  if (changes.username) {
    changes.username = changes.username.toLowerCase();
  }

  let newUsernameIsAvailable = await checkNewUsernameIsAvailable({
    currentDoc: req.user,
    newDoc: changes,
  });

  if (!newUsernameIsAvailable) return next("This username is taken");

  try {
    let newDoc = await updateDocument({
      initialDocument: doc,
      changes: changes,
      allowedFields,
      additionalChanges,
    });

    await addSearchableText({
      itemId: req.user._id,
      itemType: "PROFILE",
      loggedInUser,
    });

    return res.json({ data: newDoc });
  } catch (e) {
    return next(e.message);
  }
}

async function checkNewUsernameIsAvailable({ currentDoc, newDoc }) {
  if (currentDoc.username !== newDoc.username) {
    let user = await Profile.findOne({ username: newDoc.username });
    if (user) return false;
  }

  return true;
}
