/*
 # Documentation
 * input -> email & password
 * If the encrypt the password and if the encrypted data matches them send the JWT code
 */

import Profile from "../../../database/models/Profile.js";
import sendCookie from "../../utils/sendCookie.js";
import verifyPassword from "../../utils/verifyPassword.js";
import emailValidator from "email-validator";

export default async function emailLogin(req, res, next) {
  let { email, password } = req.body;

  if (!email) return next("Email is required.");
  if (!password) return next("Password is required.");
  if (!emailValidator.validate(email)) return next("Invalid email");

  email = email.toLowerCase();
  let existingUser = await Profile.findOne({ email });

  if (!existingUser) return next("Incorrect Email");

  if (existingUser.accountDeleted)
    return next("This account has been deleted.");

  if (!existingUser.hashedPassword) return next("Wrong Password"); // In case of login with google

  let passwordIsCorrect = await verifyPassword(
    password,
    existingUser.hashedPassword
  );

  if (!passwordIsCorrect) return next("Incorrect Password");

  return sendCookie(existingUser, res);
}
