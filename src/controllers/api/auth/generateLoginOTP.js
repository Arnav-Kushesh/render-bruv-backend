/*
 # Documentation
 * input -> email
 * if user does not exists send error
 * Create a random number and set it as changePasswordCode and email that to the user
 */

import { nanoid } from "nanoid";
import Profile from "../../../database/models/Profile.js";
import sendEmailBoilerplate from "./sendEmailBoilerplate.js";

export default async function generateLoginOTP(req, res, next) {
  let randomCode = Math.round(Math.random() * 1000000);
  let email = req.body.email;
  let user = await Profile.findOne({ email });
  if (!user) return next("Incorrect Email");
  user.changePasswordCode = randomCode;
  await user.save();

  let frenchText = {
    content: `
   Render Bruv - Your login OTP : ${randomCode}
  `,
    subject: "Login OTP - Render Bruv",
  };

  await sendEmailBoilerplate({
    receiverEmail: user.email,
    ...frenchText,
  });

  return res.json({ data: null });
}
