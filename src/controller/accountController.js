const jwtService = require('../jwt/jwtService');
const constants = require('../constants')

exports.login =  async (req, res) => {
    try {
        let userName = req.body.userName;
        let password = req.body.password;
        let user = await jwtService.getUserByUserName(userName);
        
        if(user && !user.length == 0){
            if (await jwtService.validatePassword(password, user[0].password)){
                let token = await jwtService.generateToken(userName)
                res.json({token : `Bearer ${token}`});
            } else res.status(401).json(constants.ERR_RESPONSE.INVALID_LOGIN);
        } else res.status(401).json(constants.ERR_RESPONSE.INVALID_LOGIN);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}


exports.logout = async (req, res) => {
    try {
        let token = req.headers.authorization.split(" ")[1];
        let affectedRows = await jwtService.blockToken(token);
        console.log("logout");
        if (affectedRows != 0) {
            res.send({
                message : {
                    status : 200,
                    statusText : 'OK',
                    message : "Logged out"
                }
            })
        } else {
            res.status(500).send(constants.ERR_RESPONSE.INTERNAL_SERVER_ERROR);
        }
    } catch (error) {
        res.status(500).send(constants.ERR_RESPONSE.INTERNAL_SERVER_ERROR);
    }
}