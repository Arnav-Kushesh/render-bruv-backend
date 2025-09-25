import bcrypt from 'bcrypt';

export default function verifyPassword(thePassword, hash) {
  return new Promise((resolve) => {
    bcrypt.compare(thePassword, hash, function (err, result) {
      if (err) throw err;
      if (result) {
        resolve(true);
        // console.log("Password match");
      } else {
        resolve(false);
        // console.log("Password does not match");
      }
    });
  });
}
