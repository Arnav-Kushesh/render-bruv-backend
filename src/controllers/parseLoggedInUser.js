import Profile from "../database/models/Profile.js";
import getEnvVarBasedOnEnvType from "./getEnvVarBasedOnEnvType.js";
import parseCookie from "./parseCookie.js";
import * as dotenv from "dotenv";
if (!process.env.PORT) dotenv.config();

async function parseLoggedInUser(req, res) {
  let authToken = null;

  let authorization = req.headers.authorization;

  if (authorization) {
    authorization = JSON.parse(authorization);

    if (authorization) {
      authToken = authorization.authToken;
    }
  }

  if (!authToken) return false;

  try {
    let parsedCookie = await parseCookie(authToken);
    let user = await Profile.findOne({ _id: parsedCookie.id });

    if (!user) {
      throw new Error("Invalid user");
    }
    return user;
  } catch ({ message }) {
    throw new Error(message);
  }
}

export default parseLoggedInUser;
