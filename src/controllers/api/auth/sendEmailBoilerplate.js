import sendEmail from "../../utils/sendEmail.js";

export default async function sendEmailBoilerplate({
  receiverEmail,
  content,
  subject,
  buttonText,
  buttonLink,
}) {
  let linkElement = `
    <a style="font-weight:900;border-radius:5px;padding:10px 20px;border:none;color:#111;text-decoration:none;background: linear-gradient(90deg, #a8d637, #a0ff00); box-shadow:3px 4px 1px 1px #188e0e;" href="${buttonLink}">${buttonText}</a>
          <br/><br/>
          <div>${buttonLink}</div>
  `;

  let emailContent = `
      <table width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td height="15" style="background:#EF6824;"></td>
        </tr>
        <tr>
          <td style="background:rgba(240, 104, 26, 0.22); padding:30px; padding-top:0; color:#111111 !important; font-family:Arial, sans-serif; font-size:14px; line-height:20px;">
            <br><br>  

            <font>
              ${content}
             </font>
            <br><br>
            ${buttonLink ? linkElement : ""}
            <br><br>
            <p style="margin:0;">Thanks &amp; regards,<br>Karuna Team</p>
          </td>
        </tr>
      </table>
  `;

  await sendEmail({
    receiverEmail: receiverEmail,
    htmlContent: emailContent,
    subject: subject,
  });
}
