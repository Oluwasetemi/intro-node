const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Oluwasetemi@1',
  database: 'sample'
});

connection.connect();

const users = {
  id: '2aq9a3',
  name: 'omelare',
  age: 67,
  phone: '8051906880'
};
/** create */
// connection.query('INSERT into users SET ?', users, function(
//   err,
//   results,
//   fields
// ) {
//   if (err) throw err;
//   console.log(results.affectedRows);
//   // console.log(fields);

//   console.log('The solution is:');
// });

/** read */
// connection.query('SELECT * from USERS', function(err, results, fieldInfo) {
//   if (err) {
//     console.log(err.message);
//     throw err;
//   }

//   console.log(results.length);
//   // console.log({ fieldInfo });
// });

/** update */
// connection.query(
//   'UPDATE USERS SET name = ?, age = ? WHERE id = ?',
//   ['oluwasetemi', 99, 'x12a1'],
//   function(err, results, fieldInfo) {
//     if (err) {
//       console.log(err.message);
//       throw err;
//     }

//     console.log(results.message);
//     // console.log({ fieldInfo });
//   }
// );
/** delete */
connection.query('DELETE from USERS WHERE id = "1aq2a3" ', function(
  err,
  results,
  fieldInfo
) {
  if (err) {
    console.log(err.message);
    throw err;
  }

  console.log(`deleted ${results.affectedRows} rows`);
  // console.log({ fieldInfo });
});

connection.end();
