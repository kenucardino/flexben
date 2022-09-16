const express = require('express');
require('dotenv').config({path : './config.env'});

const app = express();
app.use(express.json());

const customRouter = require('./routes/testRoute');
const accountRouter = require('./routes/accountRoute');
const categoryRouter = require('./routes/categoryRoute');

app.use('/', customRouter);
app.use('/account', accountRouter);
app.use('/category', categoryRouter);

app.listen(5000, function(){
    console.log("Running on port 5000");
});