/*
 # Documentation
 * input -> email, password
 * check if a user already exists, if user does not exists encrypt the password using bcrypt and create a user doc
 * And send the authCode
 */

import { nanoid } from "nanoid";
import Profile from "../../../database/models/Profile.js";
import hashPassword from "../../utils/hashPassword.js";
import sendCookie from "../../utils/sendCookie.js";
import emailValidator from "email-validator";
import createUserCore from "../../googleAuth/createUserCore.js";

export default async function emailSignup(req, res, next) {
  let { email, password, name } = req.body;

  if (!email) return next("Email is required.");
  if (!password) return next("Password is required.");

  email = email.toLowerCase();

  if (!emailValidator.validate(email)) return next("Invalid email");

  let hashedPassword = await hashPassword(password);

  let existingUser = await Profile.findOne({ email });

  if (existingUser) return next("Email already registered. Try logging in");

  let newUser = await createUserCore({
    name,
    email,
    emailConfirmed: false,
    hashedPassword,
    // isSuperAdmin: true,
  });

  return sendCookie(newUser, res);
}
