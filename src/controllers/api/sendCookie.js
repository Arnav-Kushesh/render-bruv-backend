import * as dotenv from "dotenv";
if (!process.env.PORT) dotenv.config();

export default function sendCookie(user, res) {
  let jwtCookie = user.generateToken();

  let userId = user._id.toString();

  res.status(200).json({ data: { token: jwtCookie, userId } });
}
