const connectionPool = require('../config/mysqlConfig');

let categoryRepository = {
    getAll : async () => {
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
    },
    getByCode : async (categoryCode) => {
        return new Promise( (resolve, reject) => {
            let query = `SELECT * FROM category WHERE code = '${categoryCode}'`;
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