const express = require('express')
const app = express()
const bodyParser = require('body-parser');

const port = 3000

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())


app.use('/', express.static('public'))
app.use('/ZeTuWGmnSDfdsghHLKhjkytlQwerEtdHkui', express.static('public/welcome.html'));


const login = require('./lib/routes/login');
app.use('/api', login);

const converter = require('./lib/routes/fileUpload');
app.use('/api', converter);

const shareFile = require('./lib/routes/shareFile');
app.use('/api', shareFile);

app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`))