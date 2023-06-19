const express = require('express');
const app = express();
const api = require('./api');

const connect = require('./db_connect');
connect();

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', api);

app.get('/', (req, res) => {
	res.redirect('./main.html');
});

app.listen('30', () => {
	console.log('30端口监听中');
});
