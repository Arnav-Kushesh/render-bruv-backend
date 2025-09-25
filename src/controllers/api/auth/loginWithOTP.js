/*
 # Documentation
 * input -> email & password
 * If the encrypt the password and if the encrypted data matches them send the JWT code
 */

import Profile from "../../../database/models/Profile.js";
import sendCookie from "../../utils/sendCookie.js";
import emailValidator from "email-validator";

export default async function loginWithOTP(req, res, next) {
  let { email, otp } = req.body;
  if (!email) return next("Email is required.");
  if (!emailValidator.validate(email)) return next("Invalid email");

  email = email.toLowerCase();

  let existingUser = await Profile.findOne({ email });

  if (!existingUser) return next("Incorrect Email");

  if (existingUser.accountDeleted)
    return next("This account has been deleted.");

  if (existingUser.changePasswordCode !== otp) return next("Wrong OTP"); // In case of login with google

  return sendCookie(existingUser, res);
}
