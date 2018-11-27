var express = require('express'),
  router = express.Router(),
  bcrypt = require('bcryptjs');

// Route for login, checks to see if the user exists in database, then hashes the POSTed password to see if it matches that users hash
// Returns message to ReactJS depending on usermatch and passmatch conditions noted above.
router.post('/login', function(req, res, next) {
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

// Function for checking if email is already in database while a user is typing in Register email field 
// Returns Boolean (True == email is unique)
.post('/checkUnique', function(req, res, next) {
  let email = req.body.email.toString();
  res.locals.connection.query("SELECT * FROM users WHERE email = ?", email, function (error, results, fields){
    if(error) throw error;
    if(results[0] != undefined){
      res.send(JSON.stringify(false));
    } else {
      res.send(JSON.stringify(true));
    }
  });
})

// Route for register with backend validations; checks all but confirm password conditions like register.
// My implementation DOES NOT check if the username is unique, because this was not a requirement - but it would be easy to implement
// Returns either a list of error messages or the usersId
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
