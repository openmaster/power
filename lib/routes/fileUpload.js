var express = require('express')
var router = express.Router()
const fileParser = require('../parsers/excelParser');
const formidable = require('formidable');


router.post('/upload', function (req, res) {
    
    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, file) => {
        if (err) {
            res.send(err);
        } else {
          try {
            const result = await fileParser(file.uploadedFile.path);
            res.send(result);
          } catch (err){
            res.statusCode = 500;
            res.send(err);
          }
        }
    });
  })
  

  console.log('fileConverter api added');
  module.exports = router