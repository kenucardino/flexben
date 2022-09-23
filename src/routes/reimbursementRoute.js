const express = require('express');
const reimbursementController = require('../controller/reimbursementController');
const { verifyToken, verifyRole } = require('../middleware/customMiddleware');
const reimbursementRoute = express.Router();
const constants = require('../constants')

reimbursementRoute.post('/item', verifyToken, reimbursementController.addReimbursementItemController);
reimbursementRoute.delete('/item', verifyToken, reimbursementController.deleteReimbursementItem);
reimbursementRoute.post('/submit', verifyToken, reimbursementController.submitReimbursement);

reimbursementRoute.get('/print', verifyToken, reimbursementController.printReimbursement);

reimbursementRoute.get('/', verifyToken, verifyRole(constants.HR_AUDIENCE.GET_REIMBURSEMENTS) , reimbursementController.getAllReimbursementsOrderByStatus);

module.exports = reimbursementRoute;