const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connectionPool = require('../config/mysqlConfig');

let jwtRepository =  {
    getUserByUserName : async  (userName) => { 
        return new Promise((resolve, reject) =>{
            connectionPool.query(`
            SELECT a.account_id, e.email, a.password, r.name AS role_name   
            FROM account AS a
            JOIN employee AS e ON a.employee_id = e.employee_id
            JOIN role AS r ON e.role_id = r.role_id
            WHERE e.email = '${userName}';`
            , (error, results, fields) =>{
                if(error){
                    reject(error);
                }else{
                    resolve(results);
                }
            })
        }); 
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
    getScopesFromRole : async (roleName) => {
        return new Promise((resolve, reject) => {
            let query = `
            SELECT s.code FROM role_scope AS rs
            JOIN role AS r on rs.role_id = r.role_id
            JOIN scope AS S ON rs.scope_id = s.scope_id
            WHERE r.name = '${roleName}'
            `; 
            connectionPool.query(query, (error, results, fields) =>{
                if (error) {
                    reject(error);
                } else {
                    let scopes = []
                    for(const element of results){
                        scopes.push(element.code);
                    }
                    resolve(scopes);
                }
            })
        });
    },

    generateToken : async (userName) =>{
        try {
            const user = await jwtRepository.getUserByUserName(userName);
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
        try{
            let userName = jwtRepository.getUserNameFromToken(token);
            let user = await jwtRepository.getUserByUserName(userName)
            return new Promise((resolve, reject) => {
                    console.log(user)
                    let userAccountId = user[0].account_id;
                    let query = `
                    INSERT INTO blocked_token (token, account_id) VALUES ('${token}', ${userAccountId});`;
                    connectionPool.query(query, (error, results)=>{
                        if(error) {
                            console.log(error)
                            reject(error);
                        } else {
                            resolve(results.affectedRows);
                        }
                    });        });
        } catch (error){
            console.log(error);
            reject(error)
        }
    },
    verifyIfBlockedToken : async (token) => {
        return new Promise((resolve, reject) =>{
            let query = `SELECT token FROM blocked_token WHERE token = '${token}';`;
            connectionPool.query(query, (error, results, fields) =>{
                if(error){
                    reject(error);
                }else{
                    if (results==''){
                        console.log("valid pa")
                        resolve(false);
                    } else{
                        console.log("ekis na")
                        resolve(true);
                    }
                }
            })
        }); 
    }
}
// async function callVerifyBlocked(){
//     jwtRepository.verifyIfBlockedToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NjMyOTM5NzUsImV4cCI6MTY2MzI5NzU3NSwiYXVkIjpbInRlc3Rfc2NvcGUxIiwidGVzdF9zY29wZTIiXSwiaXNzIjoiSk9HUkFUIiwic3ViIjoiamFuLmJlY2tAcG9pbnR3ZXN0LmNvbS5waCJ9.umVZ4RPyaKmxEukXTu3wDzbsRJxcPvUIT_OacicrX68");
// }
// async function callVerifyBlocked(){
//     jwtRepository.verifyIfBlockedToken();
// }

// callVerifyBlocked()

// async function callScopes(){
//     let scopes = await jwtRepository.getScopesFromRole('employee');
//     console.log(scopes)
// }

// callScopes()

module.exports = jwtRepository;