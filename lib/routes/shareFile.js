var express = require('express')
var router = express.Router()
const google = require('../google/utils');

router.post('/shareFile', async(req, res) => {
    const emails = req.body.emails;
    const fileName = req.body.fileName;
    const fileContent = req.body.fileContent;
    const results = [];
    for(email of emails){
        await google.uploadUserFile(fileName, fileContent, email, req.body.uploadTypeProject)
        .then(result => {
            results.push({email: email, status: true, result: result, error: null})
        }).catch(err => {
            results.push({email: email, status: false, result: null, error: err })
        })
    }
    res.send(results);
})
module.exports = router;