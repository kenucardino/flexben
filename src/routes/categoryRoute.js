const express = require('express');
const categoryRouter = express.Router();

const categoryController = require('../controller/categoryController');
const { verifyToken } = require('../middleware/customMiddleware');

categoryRouter.get('/', verifyToken, categoryController.getAllCategories)

module.exports = categoryRouter;