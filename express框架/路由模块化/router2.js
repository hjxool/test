const express = require('express');
const app = express.Router();

app.get('/page1', (req, res) => {
	res.send('页面1');
});
app.get('/page2', (req, res) => {
	res.send('页面2');
});

module.exports = app;
