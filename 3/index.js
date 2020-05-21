const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const express = require('../express');
const idGenerator = require('./util/helpers');

const app = express();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Oluwasetemi@1',
  database: 'sample'
});

connection.connect(err => {
  if (!err) {
    console.log('Database connected');
  } else {
    console.log(err.sqlMessage);
  }
});

// configure
// app.set

// middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// allow express go serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// name, age, job, phone

// home page
app.get('/', (req, res) => {
  res.send('Welcome to our user app 👯‍♂️');
});

// Edit a user
app.put('/users/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.send('Error. You must pass an id');
  }

  const { name, age, job, phone } = req.body;

  const updateValue = [];

  if (name) {
    updateValue.push(name);
  } else {
    console.log('No parameter: Name: Check the values');
  }
  if (age) {
    updateValue.push(age);
  } else {
    console.log('No parameter: Age Check the values');
  }
  if (phone) {
    updateValue.push(phone);
  } else {
    console.log('No parameter: phone Check the values');
  }
  if (job) {
    updateValue.push(job);
  } else {
    console.log('No parameter: JOB Check the values');
  }

  if (id) {
    updateValue.push(id);
  }
  console.log(updateValue);
  /* eslint-disable */
  const query = `UPDATE users SET ${name ? 'name=?' : ''} ${name && age? ',' : ''} ${ age? 'age=?': '' } ${ age && phone? ',' : ''} ${ phone? 'phone=?': '' } ${ phone && job? ',' : ''} ${job ? 'job=?' : ''} where id =? `;
  /* eslint-enable */
  console.log(query.trim());
  connection.query(query, updateValue, (err, results, fields) => {
    if (err) {
      console.log(err.message, err.sqlMessage, err.sqlState);
      res.send(err.message);
    }
    connection.query('SELECT * from USERS where id = ?', [id], function(
      err,
      result2,
      fieldInfo
    ) {
      if (err) {
        console.log(err.message);
        throw err;
      }

      console.log(result2.length);
      // console.log({ fieldInfo });
      if (!result2) return res.send('Error, user with this ID is alive');
      res.status(200).json(result2[0]);
    });
  });
});

// create a user
app.post('/users', (req, res) => {
  // check if required information about a user are sent along in the request.body

  const { name, age, job, phone } = req.body;

  // const name = req.body.name
  // const age = req.body.age
  // const job = req.body.job
  // const phone = req.body.phone

  // validation
  if (
    typeof name !== 'string' ||
    typeof age !== 'number' ||
    typeof job !== 'string' ||
    typeof phone !== 'string'
  ) {
    throw new Error('Invalid parameter: Check the values');
  }

  // create the user data
  const userData = {
    id: idGenerator(),
    name,
    age,
    job,
    phone
  };

  // store the data
  connection.query('INSERT into users SET ?', userData, function(
    err,
    results,
    fields
  ) {
    if (err) throw err;
    console.log(results.affectedRows);
    // console.log(fields);

    console.log('Data inserted');
    // console.log(users);
    // return
    return res.status(201).json({
      ...userData,
      message: 'user data saved successfully'
    });
  });
});

app.get('/users/:id', (req, res) => {
  const { id } = req.params;

  if (!id) return res.send('Error');
  connection.query('SELECT * from USERS where id = ?', [id], function(
    err,
    results,
    fieldInfo
  ) {
    if (err) {
      console.log(err.message);
      throw err;
    }

    console.log(results.length);
    // console.log({ fieldInfo });
    if (!results) return res.send('Error, user with this ID is alive');
    res.status(200).json(results[0]);
  });
});

app.get('/users', (req, res) => {
  connection.query('SELECT * from USERS', function(err, results, fieldInfo) {
    if (err) {
      console.log(err.message);
      throw err;
    }

    console.log(results.length);
    // console.log({ fieldInfo });
    res.json(results);
  });
});

app.listen('3000', () => console.log(`working http://localhost:3000`));
