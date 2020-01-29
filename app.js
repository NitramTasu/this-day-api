const express = require('express');
const app = express();
const router = express.Router();
//Rotas
const index = require('./routes/index');
const personRoute = require('./routes/users');
app.use('/', index);
app.use('/persons', personRoute);
module.exports = app;