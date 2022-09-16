const constants = require('../constants');
const jwt = require('jsonwebtoken');
const jwtService = require('../jwt/jwtService');

exports.verifyToken = async (req, res, next) => {
    if(req.headers.authorization){
        const token = req.headers.authorization.split(" ")[1];
        if(token){
            if(await jwtService.isTokenBlocked(token)){
                jwt.verify(token, process.env.SECRET, function (err) {
                    if (err) {
                        res.status(401).send(constants.ERR_RESPONSE.INVALID_TOKEN)
                    } else next();
                    });
            }else res.status(401).send(constants.ERR_RESPONSE.INVALID_TOKEN);
        } else res.status(401).send(constants.ERR_RESPONSE.INVALID_TOKEN);
    } else res.status(401).send(constants.ERR_RESPONSE.INVALID_TOKEN);
    };