/*
 # Documentation
 * input -> email
 * if user does not exists send error
 * Create a random number and set it as changePasswordCode and email that to the user
 */

import { nanoid } from "nanoid";
import Profile from "../../../database/models/Profile.js";
import sendEmailBoilerplate from "./sendEmailBoilerplate.js";
import getEnvVarBasedOnEnvType from "../../getEnvVarBasedOnEnvType.js";

export default async function forgotPassword(req, res, next) {
  let randomCode = nanoid();
  let email = req.body.email;
  let user = await Profile.findOne({ email });
  if (!user) return next("Incorrect Email");
  user.changePasswordCode = randomCode;
  await user.save();

  let frenchText = {
    content: `
      <p style="color:#B4AB87">
      We have received a request to reset your Render Bruv password.
      <br>
      If you believe you have received this message in error, please ignore it.
      <br><br>

      To change your password, click the link below or copy and paste it into your browser’s address bar:
    </p>

  `,
    buttonText: "Click here to change your password",
    subject: "Render Bruv - Forgot Password",
  };

  await sendEmailBoilerplate({
    receiverEmail: user.email,
    buttonLink: `${getEnvVarBasedOnEnvType(
      "FRONTEND_URL"
    )}/change-password/?code=${randomCode}&email=${user.email}`,
    ...frenchText,
  });

  return res.json({ data: null });
}
