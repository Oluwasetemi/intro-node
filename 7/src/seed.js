require('dotenv').config({ path: 'variables.env' });
const User = require('./models/user'); // you need the connection to the database and Campus model
const { sequelize: db } = require('./db');
const { hash } = require('./util/helpers');

const seed = async () => {
  await db.sync({ force: true }); // sync to your database!

  const harvard = await User.create({
    firstName: 'Harvard',
    lastName: 'Temitope',
    address: 'PO Box 382609. Cambridge, MA 02238-2609.',
    email: 'temi@mailinator.com',
    password: await hash('123456')
  });

  const stonybrook = await User.create({
    firstName: 'Stony',
    lastName: 'Brook',
    address: '100 Nicolls Rd, Stony Brook, NY 11794',
    email: 'temiAgain@mailinator.com',
    password: await hash('123456')
  });

  const admin = await User.create({
    firstName: 'Adefams',
    lastName: 'Admin',
    address: '100 Nicolls Rd, Stony Brook, NY 11794',
    email: 'adefam@mailinator.com',
    password: await hash('123456')
  });

  db.close(); // close your db connection else the connection stays alive else your process hangs.
  console.log('Seed Successful!'); // Have a prompt to let you know everything is working correctly!
  process.exit();
};

const deleteData = async () => {
  await User.destroy({
    where: {},
    truncate: true
  });

  db.close(); // close your db connection else the connection stays alive else your process hangs.
  console.log('Users deleted');
  process.exit();
};

if (process.argv.includes('--delete')) {
  deleteData();
} else {
  seed(); // initialize the sync!
}
