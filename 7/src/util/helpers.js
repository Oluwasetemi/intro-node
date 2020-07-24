/*
  This is a file of data and helper functions that we can expose and use in our templating function
*/
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
// FS is a built in module to node that let's us read files from the system we're running on
const fs = require('fs');

// moment.js is a handy library for displaying dates. We need this in our templates to display things like "Posted 5 minutes ago"
exports.moment = require('moment');

// Dump is a handy debugging function we can use to sort of "console.log" our data
exports.dump = (obj) => JSON.stringify(obj, null, 2);

// Making a static map is really long - this is a handy helper function to make one
exports.staticMap = ([lng, lat]) => `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=800x150&key=${process.env.MAP_KEY}&markers=${lat},${lng}&scale=2`;

// inserting an SVG
exports.icon = (name) => fs.readFileSync(`./public/images/icons/${name}.svg`);

// Some details about the site
exports.siteName = `Adefam's Shop!`;

exports.menu = [
  { slug: '/stores', title: 'Stores', icon: 'store', },
  { slug: '/tags', title: 'Tags', icon: 'tag', },
  { slug: '/top', title: 'Top', icon: 'top', },
  { slug: '/add', title: 'Add', icon: 'add', },
  { slug: '/map', title: 'Map', icon: 'map', },
];


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
