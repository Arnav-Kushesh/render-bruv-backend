import { nanoid } from "nanoid";
import Profile from "../../database/models/Profile.js";
import sendMailForEmailConfirmation from "../api/auth/sendMailForEmailConfirmation.js";

import generateUsername from "../generateUsername.js";

import generateSixDigitNumber from "../generateSixDigitNumber.js";
import addDataStatCollection from "../moneyAndStat/utils/addDataStatCollection.js";

async function createUserCore({
  name,
  email,

  googleID,
  emailConfirmed,
  hashedPassword,
  isSuperAdmin,
}) {
  let emailConfirmationCode = generateSixDigitNumber();

  let user = await Profile.findOne({ email: email });

  if (user) return user;

  let username = await generateUsername(email.split("@")[0]);
  username = username.toLowerCase();

  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);
  const profilesThisYear = await Profile.countDocuments({
    createdAt: { $gte: startOfYear },
  });

  var user_save = new Profile({
    name: name,
    username: username,
    password: null,
    email: email,
    googleID: googleID,
    emailConfirmed: emailConfirmed,
    hashedPassword: hashedPassword,
    emailConfirmationCode: emailConfirmationCode,
    name: name,
  });

  if (!emailConfirmed) {
    await sendMailForEmailConfirmation({
      receiverEmail: email,
      code: emailConfirmationCode,
    });
  }

  await addDataStatCollection({ type: "SIGNUP", amount: 1 });

  try {
    user = await user_save.save();

    return user;
  } catch (e) {
    console.log(e);
    if (e) throw new Error(e.message);
  }
}

export default createUserCore;
