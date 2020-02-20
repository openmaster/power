var express = require('express')
var router = express.Router()
const formidable = require('formidable');


router.post('/upload', function (req, res) {
    
    console.log('hitting login api');
    const form = formidable({ multiples: false });

    form.parse(req, (err, fields, files) => {
        if (err) {
            res.send(err);
        }
        for (const file of Object.entries(files)) {
            console.log(file)
          }
        res.json({ fields, files });
    });
  })
  

  console.log('fileConverter api added');
  module.exports = router