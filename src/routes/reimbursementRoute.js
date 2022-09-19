const express = require('express');
const reimbursementController = require('../controller/reimbursementController');
const { verifyToken } = require('../middleware/jwtMiddleware');
const reimbursementRoute = express.Router();

reimbursementRoute.post('/item', verifyToken, reimbursementController.addReimbursementItemController);
reimbursementRoute.delete('/item', verifyToken, reimbursementController.deleteReimbursementItem);
reimbursementRoute.post('/submit', verifyToken, reimbursementController.submitReimbursement);

reimbursementRoute.get('/print', verifyToken, reimbursementController.printtReimbursement);

module.exports = reimbursementRoute;