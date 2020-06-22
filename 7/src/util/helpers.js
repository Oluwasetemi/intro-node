const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');

if (!process.env.TOKEN_SECRET) {
  throw Error('Please set a TOKEN_SECRET in the environment variable');
}

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
 * @returns {Promise<boolean>} match - the boolean of the password compare
 */
exports.match = (password, hashedPassword) =>
  bcrypt.compare(password, hashedPassword);

/**
 * generates a token for a user
 * @function
 * @param {string} id - id of the user.
 * @param {string} email - email of the user.
 * @param {string} role - role of the user.
 * @returns {Promise<string>} token - for authenticating the user.
 */

exports.sign = id =>
  new Promise((resolve, reject) => {
    jwt.sign({ id }, process.env.TOKEN_SECRET, (err, token) => {
      if (err) return reject(err);

      return resolve(token);
    });
  });
