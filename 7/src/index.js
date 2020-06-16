require('dotenv').config({ path: 'variables.env' });
const express = require('express');

const path = require('path');
const { sequelize } = require('./db');
const routes = require('./routes');

const app = express();

// parses x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// public configuration
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// view configuration
// app.engine('ejs', require('ejs').__express);

app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

app.use('/', routes);

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});
