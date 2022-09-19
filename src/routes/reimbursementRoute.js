const express = require('express');
const reimbursementController = require('../controller/reimbursementController');
const { verifyToken } = require('../middleware/jwtMiddleware');
const reimbursementRoute = express.Router();

reimbursementRoute.post('/item', verifyToken, reimbursementController.addReimbursementItemController);
reimbursementRoute.delete('/item', verifyToken, reimbursementController.deleteReimbursementItem);

module.exports = reimbursementRoute;