export default async function getCookie(req, res, next) {
  let cookies = req.cookies;
  return res.status(200).json({ data: { cookies } });
}
