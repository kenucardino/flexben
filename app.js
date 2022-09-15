const express = require('express');
const router = express.Router();


const app = express();
app.use(express.json());

app.use(router);

app.listen(5000, function(){
    console.log("Running on port 5000");
});