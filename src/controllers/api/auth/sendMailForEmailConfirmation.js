import getEnvVarBasedOnEnvType from "../../getEnvVarBasedOnEnvType.js";
import sendEmail from "../../utils/sendEmail.js";
import sendEmailBoilerplate from "./sendEmailBoilerplate.js";

export default async function sendMailForEmailConfirmation({
  receiverEmail,
  code,
}) {
  let frenchText = {
    content: `
    <p>
  
       <span>
       We have received a request to confirm your email address for Render Bruv.
       </span> 
        <br>
        <span>
        If you believe you have received this message in error, please ignore it.
        </span>

        
        <br><br>

        <span>
        To confirm your email address, please enter the following confirmation code:
        </span>
        
        <h1>
          ${code}
        </h1>
       </p>

    `,
    subject: "Confirm Email - Render Bruv",
  };

  await sendEmailBoilerplate({
    receiverEmail: receiverEmail,

    ...frenchText,
  });
}
