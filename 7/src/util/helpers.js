const bcrypt = require('bcryptjs');
/**
 * hashes a user's password
 * @async
 * @function
 * @param {string} password - user password.
 * @returns {Promise<string>} hashed - a hashed password
 */

exports.hash = password => {
  const saltRounds = 10;
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hashed) => {
      if (err) return reject(err);

      return resolve(hashed);
    });
  });
};

/**
 *  compares a user's password with the hashed version
 * @param {string} password user password
 * @param {string} hashedPassword
 * @returns {Promise(boolean)} match - the boolean of the password compare
 */
exports.match = (password, hashedPassword) =>
  bcrypt.compare(password, hashedPassword);
