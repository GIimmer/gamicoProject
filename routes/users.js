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
  console.log("Making it here 3: ", req.body);
  let userName = req.body.userName.toString(),
    email = req.body.email.toString(),
    password = req.body.password.toString();
  var length = userName.length;
  let messages = [];
  if((length < 4) && (length > 0)){
    messages.append('Username must be at least 4 characters');
  } else if(length > 20){
    messages.append('Username must be at most 20 characters');
  }
  for(let i=0; i<length; i++){
    let c = userName.charCodeAt(i);
    if((c >= 48 && c <= 57) || (c >= 65 && c <= 90) || (c >= 97 && c <= 122)){
      continue;
    } else {
      messages.append('Username must be alphanumeric');
    }
  }
  length = email.length;
  if(length > 50){
    messages.append('Email must be less than 50 characters');
  }
  if(!(/[^@]+@[^@]+\.[^@]/.test(email))){
    messages.append('Invalid email format');
  }
  length = password.length;
  if(length < 8){
    messages.append('Password must be at least 8 characters');
  } else if(length > 20){
    messages.append('Password must be at most 20 characters');
  }
  console.log('made it here', messages, password);
  if(messages.length > 0){
    res.send(JSON.stringify(results));
  }


  res.locals.connection.query("SELECT * FROM users WHERE email = ?", email, function (error, results, fields) {
    if(error) throw error;
    console.log("Here is results: ", results);
    console.log("results.TextRow: ", results[0]);
    if(results[0] != undefined){
      res.send(JSON.stringify('A user with this email already exists'));
    } else {
      res.locals.connection.query("INSERT INTO users (username, email, password) VALUES ('" + userName + "', '" + email + "', '" + password + "') ", function (error, results, fields) {
        if(error) throw error;
        console.log("What are the results?", results);
        res.send(JSON.stringify(results));
      });
    }
  });
  // console.log("Here are the deets: ", values);
});

module.exports = router;
