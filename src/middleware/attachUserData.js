import parseLoggedInUser from "../controllers/parseLoggedInUser.js";

async function attachUserData(req, res, next) {
  try {
    let user = await parseLoggedInUser(req, res);

    // console.log(user, "Logged in user");
    req.user = user;
    next();
  } catch (e) {
    next(e);
  }
}

export default attachUserData;
