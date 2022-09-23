const connectionPool = require('../config/mysqlConfig');

let jwtRepository =  {
    getUserByUserName : async  (userName) => { 
        return new Promise((resolve, reject) =>{
            connectionPool.query(`
            SELECT a.account_id, e.email, a.password, e.employee_id, r.name AS role_name   
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

    blockToken : async (user, token) => {
        try{
            return new Promise((resolve, reject) => {
                    let userAccountId = user[0].account_id;
                    let query = `
                    INSERT INTO blocked_token (token, account_id) VALUES ('${token}', ${userAccountId});`;
                    console.log(query)
                    connectionPool.query(query, (error, results)=>{
                        if(error) {
                            reject(error);
                        } else {
                            resolve(results.affectedRows);
                        }
                    });        
                });
        } catch (error){
            console.log(error);
            reject(error)
        }
    },
    getBlockedToken : async (token) => {
        return new Promise((resolve, reject) =>{
            let query = `SELECT token FROM blocked_token WHERE token = '${token}';`;
            connectionPool.query(query, (error, results, fields) =>{
                if(error){
                    reject (error);
                }else{
                    resolve (results);
                }
            })
        }); 
    }
}


module.exports = jwtRepository;