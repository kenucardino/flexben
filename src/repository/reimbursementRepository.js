const connectionPool = require('../config/mysqlConfig');
const jwtRepository = require('../jwt/jwtRepository');

let reimbursementRepository = {
    getReimbursementById : async (id) => {
        return new Promise( (resolve, reject) => {
            let query = `
            SELECT * FROM flex_reimbursement AS fr
            JOIN employee AS e ON fr.employee_id = e.employee_id
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
            UPDATE flex_reimbursement SET employee_id = ${reimbursementObject.employee_id}, flex_cut_off_id = ${reimbursementObject.flex_cut_off_id},  total_reimbursement_amount = ${reimbursementObject.total_reimbursement_amount}, date_submitted = '${reimbursementObject.date_submitted}', status = '${reimbursementObject.status}', date_updated = current_timestamp(), transaction_number = '${reimbursementObject.transaction_number}'
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
    },
    getReimbursementAndDetailsById : async (id) =>{
        return new Promise ((resolve, reject) => {
            let query = `
            SELECT com.code, fcf.flex_cycle_cutoff_id, fr.flex_reimbursement_id, fr.status , e.last_name, e.first_name, e.employee_number, fr.total_reimbursement_amount, fr.transaction_number, fr.date_submitted  
            FROM flex_reimbursement AS fr 
            JOIN flex_cycle_cutoff AS fcf ON fr.flex_cut_off_id = fcf.flex_cycle_cutoff_id 
            JOIN employee AS e ON fr.employee_id = e.employee_id 
            JOIN company AS com ON e.company_id = com.company_id 
            WHERE fr.flex_reimbursement_id =${id}`
            connectionPool.query(query, (error, results) => {
                if (error) {
                    console.log(error)
                    reject (error)
                } else {
                    resolve (results);
                }
            }); 
        })
    },
    getAllReimbursmentsSortByStatus : async (status, cutOffId) => {
        return new Promise ((resolve, reject) =>{
            let query = `
            SELECT fr.transaction_number, e.employee_number, e.first_name, e.last_name, fr.total_reimbursement_amount, fr.date_submitted, fr.status
            FROM flex_reimbursement AS fr 
            JOIN employee AS e ON fr.employee_id = e.employee_id
            WHERE flex_cut_off_id = ${cutOffId}
            ORDER BY fr.status = '${status}';
            `;
            connectionPool.query(query, (error, results) => {
                if (error) {
                    console.log(error)
                    reject (error)
                } else {
                    resolve (results);
                }
            }); 
        });
    }
}

module.exports = reimbursementRepository;