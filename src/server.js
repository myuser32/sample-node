const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
var CircularJSON = require('circular-json')

const app = express();

app.use(bodyParser.json({limit:'6mb'}));
app.use(express.json({ type: 'application/json' }));
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => {
	res.send('Sample GET: ' + CircularJSON.stringify(req));
});

app.post('/', (req, res) => {
	res.send('Sample GET: ' + CircularJSON.stringify(req));
});

module.exports = app;