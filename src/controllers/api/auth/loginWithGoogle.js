import * as dotenv from "dotenv";

import handleOAuth2 from "../../googleAuth/handleOAuth2.js";
import createUser from "../../googleAuth/createUser.js";
import sendCookie from "../../utils/sendCookie.js";
if (!process.env.PORT) dotenv.config();

export default async function loginWithGoogle(req, res, next) {
  try {
    let data = await handleOAuth2(req.body);
    let user = await createUser(data);

    if (user.accountDeleted) return next("Account deleted.");
    return sendCookie(user, res);
  } catch (e) {
    console.warn(e);
    next(e);
  }
}
