var express = require('express'),
  router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.locals.connection.query('SELECT * FROM users', function (error, results, fields) {
   if(error) throw error;
   res.send(JSON.stringify(results));
 });
})

// GET single user by id
.post('/login', function(req, res, next) {
  let email = req.body.email.toString(),
    password = req.body.password.toString();
  let message = '';
  res.locals.connection.query("SELECT username, usersId, password FROM users WHERE email = ?", email, function (error, results, fields) {
   if(error) throw error;
   if(results[0] == undefined){
     message = 'No user with that email exists';
   } else if(results[0].password !== password){
     message = 'Password does not match with the user on record';
   }
   if(message === ''){
     res.send(JSON.stringify(results[0]));
   } else {
     res.send(JSON.stringify([message]));
   }
 });
})

.post('/', function(req, res, next) {
  let userName = req.body.userName.toString(),
    email = req.body.email.toString(),
    password = req.body.password.toString();
  var length = userName.length;
  let messages = [];
  if((length < 4) && (length >= 0)){
    messages.push('Username must be at least 4 characters');
  } else if(length > 20){
    messages.push('Username must be at most 20 characters');
  }
  for(let i=0; i<length; i++){
    let c = userName.charCodeAt(i);
    if((c >= 48 && c <= 57) || (c >= 65 && c <= 90) || (c >= 97 && c <= 122)){
      continue;
    } else {
      messages.push('Username must be alphanumeric');
      break;
    }
  }
  length = email.length;
  if(length > 50){
    messages.push('Email must be less than 50 characters');
  }
  if(!(/[^@]+@[^@]+\.[^@]/.test(email))){
    messages.push('Invalid email format');
  }
  length = password.length;
  if(length < 8){
    messages.push('Password must be at least 8 characters');
  } else if(length > 20){
    messages.push('Password must be at most 20 characters');
  }
  if(messages.length > 0){
    res.send(JSON.stringify(messages));
  } else {
    res.locals.connection.query("SELECT * FROM users WHERE email = ?", email, function (error, results, fields) {
      if(error) throw error;
      if(results[0] != undefined){
        res.send(JSON.stringify(['A user with this email already exists']));
      } else {
        res.locals.connection.query("INSERT INTO users (username, email, password) VALUES ('" + userName + "', '" + email + "', '" + password + "') ", function (error, results, fields) {
          if(error) throw error;
          res.send(JSON.stringify(results));
        });
      }
    });
  }
});

module.exports = router;
