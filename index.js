const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

const pageRouter = require('./routes/servingPage');

dotenv.config();
const app = express();

app.use('/', pageRouter);

app.use(express.static(path.join(__dirname, 'static')));

app.listen(process.env.PORT || 3000, (err) => {
	if (err) {
		console.log('error launching the server');
	} else {
		console.log('Server has been started');
	}
});
