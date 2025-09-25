/*
 # Documentation
 * input -> newPassword, changePasswordCode, email
 * If changePassword code matches then encrypt the new password and set it
 */

import Profile from "../../../database/models/Profile.js";
import hashPassword from "../../utils/hashPassword.js";
import sendCookie from "../../utils/sendCookie.js";

export default async function changePassword(req, res, next) {
  let user = req.user;
  const { code, password, confirmPassword, email } = req.body;

  if (!password) return next("password is required");
  if (password !== confirmPassword)
    return next("password & confirm Password should be same");

  let query = {};

  if (user) {
    query = { _id: user._id };
  } else {
    query = { email };
  }

  let profile = await Profile.findOne(query);

  if (!profile) return next("User not found");

  let hashedPassword = await hashPassword(password);

  if (!user) {
    if (profile.changePasswordCode !== code) return next("Permission Denied");
  }

  profile.hashedPassword = hashedPassword;
  profile.changePasswordCode = null;

  let newUser = await profile.save();

  return sendCookie(newUser, res);
}
