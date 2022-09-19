const categoryService = require('../service/categoryService');
const constants = require('../constants');
const jwtService = require('../jwt/jwtService');
const util = require('../util/util');

exports.getAllCategories = async (req, res) =>{
    try {        
        let token = req.headers.authorization.split(" ")[1];
        if (jwtService.getAudienceFromToken(token).includes(constants.AUDIENCE.GET_ALL_CATEGORIES)){
            let categories = await categoryService.getAllCategories();
            res.send(util.successResponseBuilder(200,"OK", "Categories fetched", categories));
        
        } else res.status(403).send(constants.ERR_RESPONSE.FORBIDDEN)
    } catch (error) {
        console.log(error)
        res.status(500).send(constants.ERR_RESPONSE.INTERNAL_SERVER_ERROR)
    }
}