const express = require('express')
const app = express()
const bodyParser = require('body-parser');

const port = 3000

app.use(bodyParser.urlencoded({extended: true}));


app.use('/', express.static('public'))
app.use('/welcome', express.static('public/welcome.html'));


const login = require('./lib/routes/login');
app.use('/api', login);

const converter = require('./lib/routes/fileConverter');
app.use('/api', converter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))