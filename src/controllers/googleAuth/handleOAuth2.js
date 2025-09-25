import * as dotenv from 'dotenv';
if (!process.env.PORT) dotenv.config();

import fetch from 'node-fetch';
import getUserInfo from './getUserInfo.js';
let CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID_PUBLIC;
let GOOGLE_LOGIN_SECRET = process.env.GOOGLE_OAUTH_SECRET;

async function handleOAuth2({ code, location }) {
  // console.log("handleOAuth2", code, location);
  // console.log(
  //   "---------------------------------------------------------------"
  // );
  const tokenResponse = await fetch(
    `https://www.googleapis.com/oauth2/v4/token`,
    {
      method: 'POST',
      body: JSON.stringify({
        code: code,
        client_id: CLIENT_ID,
        client_secret: GOOGLE_LOGIN_SECRET,
        redirect_uri: location,
        grant_type: 'authorization_code',
      }),
    }
  );
  const tokenJson = await tokenResponse.json();
  const userInfo = await getUserInfo(tokenJson.access_token);

  if (tokenJson.error) {
    throw new Error(tokenJson.error.message);
  }

  if (userInfo.error) {
    throw new Error(userInfo.error);
  }

  return { accessToken: tokenJson.access_token, userInfo: userInfo };
}

export default handleOAuth2;
