var express = require('express'),
  router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("making it here 1");
  res.locals.connection.query('SELECT * FROM users', function (error, results, fields) {
   if(error) throw error;
   res.send(JSON.stringify(results));
 });
})

// GET single user by id
.get('/:id', function(req, res, next) {
  console.log("Making it here 2");
  let UserId = req.body.userId;
  res.locals.connection.query('SELECT * FROM users WHERE UserId = `?`', UserId, function (error, results, fields) {
   if(error) throw error;
   res.send(JSON.stringify(results));
 });
})

// Create new user
.post('/', function(req, res, next) {
  console.log("Making it here 3");
  let userName = req.body.userName.toString(),
    email = req.body.email.toString(),
    password = req.body.password.toString();
 
  // console.log("Here are the deets: ", values);

  res.locals.connection.query("INSERT INTO users (username, email, password) VALUES ('" + userName + "', '" + email + "', '" + password + "') ", function (error, results, fields) {
   if(error) throw error;
   console.log("What is res?", res);
   res.send(JSON.stringify(results));
 });
});

module.exports = router;
