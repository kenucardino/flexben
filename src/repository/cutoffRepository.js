const connectionPool = require('../config/mysqlConfig');

let cutOffRepository = {
    getCutOffById : async (id) => {
        return new Promise((resolve, reject) => {
            let query = `
            SELECT * FROM flex_cycle_cutoff
            WHERE flex_cycle_cutoff_id = ${id}`
            
            connectionPool.query(query, (error, results) =>{
                if (error) {
                    console.log(error);
                    reject(error);        
                } else {
                    resolve(results[0])
                }
            });
        });
    }
}

module.exports = cutOffRepository;