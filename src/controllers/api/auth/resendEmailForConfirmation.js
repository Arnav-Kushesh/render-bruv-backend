/*
 # Documentation
  * input -> confirmationCode, userId
  * find the user doc and if confirmationCode matches then  
*/

import { nanoid } from "nanoid";
import Profile from "../../../database/models/Profile.js";
import sendMailForEmailConfirmation from "./sendMailForEmailConfirmation.js";
import generateSixDigitNumber from "../../generateSixDigitNumber.js";

export default async function resendEmailForConfirmation(req, res, next) {
  let user = req.user;

  if (!user) return next("Login is required.");

  let doc = user;
  let emailConfirmationCode = generateSixDigitNumber();

  doc.emailConfirmationCode = emailConfirmationCode;
  doc = await doc.save();

  await sendMailForEmailConfirmation({
    receiverEmail: doc.email,
    code: emailConfirmationCode,
  });

  return res.json({ data: true });
}
