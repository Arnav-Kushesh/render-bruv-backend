import bcrypt from 'bcrypt';

export default function hashPassword(thePassword) {
  return new Promise((resolve) => {
    const saltRounds = 10; // Number of salt rounds

    bcrypt.hash(thePassword, saltRounds, function (err, hash) {
      if (err) throw err;

      // Store hash in your password database.
      resolve(hash);
    });
  });
}
