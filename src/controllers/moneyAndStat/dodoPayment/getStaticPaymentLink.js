import getEnvVarBasedOnEnvType from "../../getEnvVarBasedOnEnvType.js";

export default function getStaticPaymentLink(req, res, next) {
  let { amountInDollars } = req.query;

  if (!amountInDollars) return next("Invalid Quantity");

  amountInDollars = parseInt(amountInDollars);

  if (isNaN(amountInDollars)) return next("Invalid Amount");

  let quantity = Math.round(amountInDollars / 5);

  if (!quantity) return next("Invalid Amount");

  let theFiveDollarProductId = getEnvVarBasedOnEnvType(
    "DODO_FIVE_DOLLAR_PRODUCT_ID"
  );

  let envType = process.env.ENV_TYPE;
  let isDev = envType == "development";

  let redirectUrl = getEnvVarBasedOnEnvType("FRONTEND_URL") + "/verify-payment";

  let baseUrl = `https://checkout.dodopayments.com`;
  if (isDev) baseUrl = `https://test.checkout.dodopayments.com`;

  let url = `${baseUrl}/buy/${theFiveDollarProductId}/?quantity=${quantity}&redirect_url=${redirectUrl}`;

  return res.json({ data: url });
}
