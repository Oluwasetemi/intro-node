const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello Word');
});

app.get('/welcome/:name', (req, res) => {
  console.log(req.params);
  console.log(req.query);
  res.send(`Hello Word! Your Welcome ${req.params.name}`);
});

app.listen(3000, () => {
  console.log('App listening on port http://localhost:3000');
});
