const connectionPool = require('../config/mysqlConfig');
const jwtRepository = require('../jwt/jwtRepository');

let reimbursementRepository = {
    addReimbursementDetail : (reimbursementObject) => {
        return new Promise( (resolve, reject) => {
            let query = `SELECT * FROM category`;
            connectionPool.query(query, (error, results, fields) => {
                if (error) {
                    reject();
                } else {
                    resolve ()
                }
            });
        });
    },
    checkExistingDraftReimbursement : (employeeId) => {
        return new Promise( (resolve, reject) => {
            
        });
    }
}

module.exports = reimbursementRepository;