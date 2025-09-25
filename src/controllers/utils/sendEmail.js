import { Resend } from "resend";

export default async function sendEmail({
  htmlContent,
  receiverEmail,
  subject,
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  console.log("Sending email to " + receiverEmail, subject);
  // console.log("Sending email to " + receiverEmail, subject, htmlContent);
  // console.log("hello!!");

  try {
    await resend.emails.send({
      from: "NoReply <noreply@upon.one>",
      to: [receiverEmail],
      subject: subject,
      html: htmlContent,
    });
  } catch (e) {
    console.warn(e.message);
    throw Error(e.message);
  }
}
