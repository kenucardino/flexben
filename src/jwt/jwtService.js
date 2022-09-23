const jwtRepository = require('../jwt/jwtRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

let jwtService = {
    getUserByUserName : async (userName) => {
        try {
            let user = await jwtRepository.getUserByUserName(userName)
            return Promise.resolve(user);
        } catch (error) {
            return error;
        }
    },
    validatePassword : async (passwordFromRequest, passwordFromDatabase) => {
        try {
        return bcrypt.compare(passwordFromRequest, passwordFromDatabase).then((result) => result);
        } catch (error) {
            //double check what should be sent, error or 'false'
            return error;
        }
    },
    getAudienceFromToken : (token) => jwt.decode(token)["aud"],

    getUserNameFromToken : (token) => {
        let userName = jwt.decode(token)["sub"];
        return userName;
    },

    generateToken : async (userName) => {
        try {
            const user = await jwtService.getUserByUserName(userName);
            const roles = await jwtRepository.getScopesFromRole(user[0].role_name);
            const options = {
            algorithm: process.env.ALGORITHM,
            expiresIn: process.env.EXPIRY,
            issuer: process.env.ISSUER,
            subject: userName,
            audience : roles
        };
        return jwt.sign({}, process.env.SECRET, options);
        } catch (error) {
            console.log(`Error from generateToken :${error}`)
            return error;
        }
    },
    blockToken : async (token) => {
        try {
            console.log("logout");
            let userName = jwtService.getUserNameFromToken(token);
            let user = await jwtService.getUserByUserName(userName);
            let affectedRows = await jwtRepository.blockToken(user, token);
            return Promise.resolve(affectedRows);
        } catch (error) {
            return error;
        }
    },
    isTokenBlocked : async (token) => {
        return new Promise(async (resolve, reject)=> {
            try{
                let result = await jwtRepository.getBlockedToken(token);
                    if (result=='') {
                        resolve(true);
                    } else {
                        resolve(false)
                    }
            } catch (error) {
                reject(error);
            }
        })
    }
}

module.exports = jwtService;