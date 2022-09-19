const express = require('express');
const reimbursementController = require('../controller/reimbursementController');
const { verifyToken } = require('../middleware/jwtMiddleware');
const accountRouter = express.Router();

accountRouter.post('/add',  reimbursementController.addReimbursementItemController);

module.exports = accountRouter;