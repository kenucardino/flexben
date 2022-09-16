const categoryService = require('../service/categoryService');
const constants = require('../constants');
const util = require('../util/util')

exports.getAllCategories = async (req, res) =>{
    try {
        let categories = await categoryService.getAllCategories();
        res.send(util.getResponseBuilder("OK", "Categories fetched", categories));
    } catch (error) {
        console.log(error)
        res.status(500).send(constants.ERR_RESPONSE.INTERNAL_SERVER_ERROR)
    }
}