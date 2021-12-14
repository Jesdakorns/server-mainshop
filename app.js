const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const fs = require('fs') // ใช้งาน file system module ของ nodejs

const route = require('./routes/routes');

const app = express()
const port = 8080

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(route);

app.listen(port, () => console.log(`Example app listening on port port:  http://localhost:${port}`));
module.exports = app