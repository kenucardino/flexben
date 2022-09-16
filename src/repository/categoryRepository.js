const connectionPool = require('../config/mysqlConfig');

let categoryRepository = {
    getAllCateogories : async () => {
        return new Promise( (resolve, reject) => {
            let query = `SELECT * FROM category`;
            connectionPool.query(query, (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve (results)
                }
            });
        });
    }
}

module.exports = categoryRepository;