import createUser from "../../googleAuth/createUser.js";
import getUserInfo from "../../googleAuth/getUserInfo.js";

export default async function postGoogleAuthAccessToken(req, res, next) {
  if (!req.body.accessToken) return next("Access Token not defined");

  // console.log("login in---", jwtCookie);

  try {
    let data = await getUserInfo(req.body.accessToken);
    // console.log(req.body, data);
    let user = await createUser({ userInfo: data });
    return sendResponse(user);
  } catch (e) {
    console.warn(e);
    next(e);
  }

  function sendResponse(user) {
    let jwtCookie = user.generateToken();

    res.status(200).json({ data: { token: jwtCookie, userId: user._id } });
  }
}
