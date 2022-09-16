const connectionPool = require("../config/mysqlConfig")

let testRepository = {
    test : () => {
        return new Promise((resolve, reject) => {
            connectionPool.query('SELECT * FROM account', (error, results, fields) =>{
                console.log(results);
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        })
    }
}

module.exports = testRepository;