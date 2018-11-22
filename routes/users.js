var express = require('express'),
  router = express.Router(),
  bcrypt = require('bcryptjs');

// Basic route - unused
router.get('/', function(req, res, next) {
  res.locals.connection.query('SELECT * FROM users', function (error, results, fields) {
   if(error) throw error;
   res.send(JSON.stringify(results));
 });
})

// Route for login
.post('/login', function(req, res, next) {
  let email = req.body.email.toString(),
    password = req.body.password.toString();
  let message = '';
  res.locals.connection.query("SELECT username, usersId, password FROM users WHERE email = ?", email, function (error, results, fields) {
    if(error) throw error;
    if(results[0] == undefined){
      res.send(JSON.stringify(['No user with that email exists']));
    } else{
      bcrypt.compare(password, results[0].password,(err, outcome)=>{
        if (err) { throw (err); }
        if(!outcome){
          res.send(JSON.stringify(['Password does not match with the user on record']));
        } else {
          if(message === ''){
            delete results[0].password;
            res.send(JSON.stringify(results[0]));
          } else {
            res.send(JSON.stringify([message]));
          }
        }
      })
    }
  })
})

// Route for register with backend validations
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
        password = bcrypt.hash(password, 10, (err, hash)=>{
          if (err) { throw (err); }
          res.locals.connection.query("INSERT INTO users (username, email, password) VALUES ('" + userName + "', '" + email + "', '" + hash + "') ", function (error, results, fields) {
            if(error) throw error;
            res.send(JSON.stringify(results));
          });
        });
      }
    });
  }
});

module.exports = router;
