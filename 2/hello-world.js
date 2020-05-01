const express = require('express');
const {
  readFile,
  readFileSync,
  writeFileSync,
  writeFile
} = require('fs').promises;

const app = express();

// app['method'](route, callback)

app.get('/', (req, res) => {
  res.send('Hello Word');
});

// callback hell
// callback(
//   (err,
//   data => {
//     anotherCallback(age, (err, data) => {
//       anotherAnotherCallback(name, (err, data) => {
//         //
//       });
//     });
//   })
// );
app.get('/count', function(req, res) {
  // callback implementation
  // readFile('./count.txt', 'utf-8', (err, count) => {
  //   count++;
  //   writeFile('./count.txt', count, () => {
  //     res.send(String(count));
  //   });
  // });
  readFile('./count.txt', 'utf8')
    .then(count => {
      count++;
      writeFile('./count.txt', count).then(() => {
        res.send(String(count));
      });
    })
    .catch(err => {
      res.send(`${err.message}`);
    });

  // async and await
  // const count = await writeFile('./count.txt', 'utf-8');
  // count += 1;
  // await writeFile('./count.txt', count);
  // res.send(String(count));
});

// TODO:
// create 3 different routes - callbacks, promises, async/await
// each routes should read from 2 different file(a.txt, b.txt);
// add the 2 values together
// write into another file(sum.txt)

app.get('/welcome/:name', (req, res) => {
  console.log(req.params);
  console.log(req.query);
  res.send(`Hello Word! Your Welcome ${req.params.name}`);
});

app.listen(3000, () => {
  console.log('App listening on port http://localhost:3000');
});
