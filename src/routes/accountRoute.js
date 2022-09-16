const express = require('express');
const accountController = require('../controller/accountController');
const { verifyToken } = require('../middleware/jwtMiddleware');
const accountRouter = express.Router();

accountRouter.post('/login',  accountController.login);
accountRouter.post('/logout', verifyToken, accountController.logout);

module.exports = accountRouter;