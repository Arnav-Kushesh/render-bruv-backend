import sendEmailBoilerplate from "./sendEmailBoilerplate.js";

export default async function sendMailForAccountDeletion({
  receiverEmail,
  code,
}) {
  let frenchText = {
    content: `
  <p>
We have received a request to delete your Karuna account.
<br>
If you believe you have received this message in error, please ignore it.
<br><br>
To confirm the deletion of your account, please use the following confirmation code:
  <h1>
    ${code}
  </h1>
</p>

    `,
    subject: "Karuna - Account Deletion",
  };

  await sendEmailBoilerplate({
    receiverEmail: receiverEmail,
    ...frenchText,
  });
}
