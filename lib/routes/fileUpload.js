var express = require('express')
var router = express.Router()
const fileParser = require('../contentProcessors/excelParser');
const createXml = require('../contentProcessors/createXml');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');


router.post('/upload', function (req, res) {
    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, file) => {
        if (err) {
            res.send(err);
        } else {
          try {
            const data = await fileParser(file.uploadedFile.path);
            const xmlData = await createXml(data);
            fs.writeFile(path.join(__dirname, 'project.xml'), xmlData, (err, ok) => {
              if (err){
                res.statusCode = 500;
                res.send(err);
              } else {
                //res.download(path.join(__dirname, 'project.xml'))
                res.send(xmlData);
              }
            });
          } catch (err){
            res.statusCode = 500;
            res.send(err);
          }
        }
    });
  })
  
  router.post('/uploadCT', function (req, res) {
    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, file) => {
        if (err) {
            res.send(err);
        } else {
          try {
            
            fs.readFile(file.uploadedFile.path, (err, content) => {
              if(err){
                res.statusCode = 500;
                res.send(err)
              }
              fs.writeFile(path.join(__dirname, 'ct.xml'), content, (err, ok) => {
                if (err){
                  res.statusCode = 500;
                  res.send(err);
                } else {
                  res.download(path.join(__dirname, 'ct.xml'))
                }
              });
            })
            res.send('hitting uploadCT api')
            res.json({ fields, files });
          } catch (err){
            res.statusCode = 500;
            res.send(err);
          }
        }
    });
  })

  console.log('fileConverter api added');
  module.exports = router