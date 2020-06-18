const express = require('express');
const connection = require('./services/connection');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const userRouter = require('./routes/user');

app.use('/users', userRouter);


var server = app.listen(5000, function (req, res) {
	console.log('you are listening to server 5000');
});
