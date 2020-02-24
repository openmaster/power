var express = require('express')
var router = express.Router()


router.post('/login', function (req, res) {
    if(isValid(req.body)){
        res.redirect('/ZeTuWGmnSDfdsghHLKhjkytlQwerEtdHkui');
    } else {
        res.statusCode = 401;
        res.send('unauthorize');
    }
  });
  
  router.get('/logout', function (req, res) {
    res.send('logout api is working ')
  });

  function isValid(body) {
      if(body.username === "admin" && body.password === "admin"){
          return true;
      } else {
          return false;
      }
  }

  console.log('login api added');
  module.exports = router