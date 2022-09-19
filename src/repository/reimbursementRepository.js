const connectionPool = require('../config/mysqlConfig');
const jwtRepository = require('../jwt/jwtRepository');

let reimbursementRepository = {
    getReimbursementById : async (id) => {
        return new Promise( (resolve, reject) => {
            let query = `
            SELECT * FROM flex_reimbursement 
            WHERE flex_reimbursement_id  = ${id};
            `
            connectionPool.query(query, (error, results, fields) => {
                if (error) {
                    reject (error)
                } else {
                    console.log(error)
                    resolve (results);
                }
            });
        });
    },
    getInDraftReimbursementByEmployeeId : async (employeeId) => {
        return new Promise( (resolve, reject) => {
            let query = `
            SELECT * FROM flex_reimbursement 
            WHERE employee_id = ${employeeId} && status = 'Draft'
            `
            connectionPool.query(query, (error, results, fields) => {
                if (error) {
                    reject (error)
                    console.log(error)
                } else {
                    resolve (results);
                }
            });
        });
    },
    addReimbursement : async (reimbursementObject) => {
        console.log("add reimbursement ")
        return new Promise((resolve, reject) => {
            let query = `
            INSERT INTO flex_reimbursement 
            VALUES(NULL, ${reimbursementObject.employeeId},${reimbursementObject.cutOffId},${reimbursementObject.totalReimbursementAmount}, '${reimbursementObject.dateSubmitted}', '${reimbursementObject.status}', '${reimbursementObject.dateUpdated}','${reimbursementObject.transactionNumber}')
            `
            connectionPool.query(query, (error, results) => {
                if (error) {
                    reject (error)
                } else {
                    resolve (results.insertId);
                }
            });  
        })
    },
    updateReimbursement : async (reimbursementObject) => {
        return new Promise((resolve, reject) => {
            let query = `
            UPDATE flex_reimbursement SET employee_id = ${reimbursementObject.employee_id}, flex_cut_off_id = ${reimbursementObject.flex_cut_off_id},  total_reimbursement_amount = ${reimbursementObject.total_reimbursement_amount}, date_submitted = '${reimbursementObject.date_submitted}', status = '${reimbursementObject.status}', date_updated = current_timestamp(), transacation_number = '${reimbursementObject.transacation_number}'
            WHERE flex_reimbursement_id =${reimbursementObject.flex_reimbursement_id}
            
            `
            connectionPool.query(query, (error, results) => {
                if (error) {
                    console.log(error)
                    reject (error)
                } else {
                    resolve (results.affectedRows);
                }
            });  
        })
    }
}

module.exports = reimbursementRepository;