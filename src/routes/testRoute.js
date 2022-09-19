const express = require('express');
const router = express.Router();

router.get('/', (req, res) =>{
    res.send("OK ROUTE")
})

router.post('/testDate', (req, res) =>{

    let startDate = new Date("2018-09-01 00:00:00");
    let setDate = new Date("2018-10-31 00:00:00")
    let endDate = new Date("2018-12-31 00:00:00")
    let date =new Date(req.body.date);
    let currentDate = new Date();

    if (setDate > startDate && setDate < endDate) {
        console.log("pasok")
    }
    
    console.log(setDate > startDate);

    res.send({
        currentDate : currentDate,
        date : date,
        startDate : startDate,
        endDate : endDate
    });
})

module.exports = router;