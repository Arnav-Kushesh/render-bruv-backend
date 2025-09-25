/*
 # Documentation
 * input -> confirmationCode, userId
 * find the user doc and if confirmationCode matches then  
 */

import Profile from "../../../database/models/Profile.js";

export default async function confirmEmail(req, res, next) {
  let loggedInUser = req.user;

  if (!loggedInUser) return next("Login Required");

  let loggedInUserId = loggedInUser._id;

  let { code } = req.body;

  if (!code) return next("emailConfirmationCode is required");

  let user = await Profile.findOne({ _id: loggedInUserId });

  if (!user) return next("User not found");

  if (user.emailConfirmed) return res.json({ data: true });

  let savedCode = user.emailConfirmationCode;

  savedCode = savedCode.toString();
  code = code.toString();

  if (user.emailConfirmationCode !== code) return next(`Verification Failed`);

  user.emailConfirmed = true;
  user.emailConfirmationCode = null;

  await user.save();

  return res.json({ data: true });
}
