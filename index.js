const envPath = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';

require('dotenv').config({ path: envPath });

const app = require('express')();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use('/api', require('./app/routes'));

app.listen(3000);

module.exports = app;
