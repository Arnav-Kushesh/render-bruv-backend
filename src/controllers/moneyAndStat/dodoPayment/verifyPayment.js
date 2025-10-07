import DodoPayments from "dodopayments";
import getEnvVarBasedOnEnvType from "../../getEnvVarBasedOnEnvType.js";
import RechargeHistory from "../../../database/models/money/RechargeHistory.js";
import registerRecharge from "../coreMoneyActions/registerRecharge.js";

export default async function verifyPayment(req, res, next) {
  let user = req.user;

  if (!user) return next("Login Required");

  try {
    const client = new DodoPayments({
      bearerToken: getEnvVarBasedOnEnvType("DODO_PAYMENTS_API_KEY"),
    });

    let { paymentId } = req.body;

    const payment = await client.payments.retrieve(paymentId);

    let quantity = 0;

    if (!payment) return next("Payment data not found");

    let productId = getEnvVarBasedOnEnvType("DODO_FIVE_DOLLAR_PRODUCT_ID");

    if (payment.product_cart) {
      for (let item of payment.product_cart) {
        if (item.product_id == productId) {
          quantity += item.quantity;
        }
      }
    }

    if (!quantity) return next("Quantity is zero");

    let totalDollars = quantity * 5;

    let amountInCents = totalDollars * 100;

    let existingTransaction = await RechargeHistory.findOne({
      transactionId: paymentId,
    });

    if (existingTransaction) return next("Payment has already been verified");

    await registerRecharge({
      userId: user._id,
      amountInCents: amountInCents,
      transactionId: paymentId,
      paymentFacilitator: "DODO_PAYMENT",
    });

    console.log(payment.brand_id);

    return res.json({ data: { amountInCents } });
  } catch (e) {
    return next(e.message);
  }
}
