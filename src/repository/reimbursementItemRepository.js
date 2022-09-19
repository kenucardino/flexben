const connectionPool = require('../config/mysqlConfig');

let reimbursementItemRepository = {
    addReimbursementItem : async (reimbursementItemObject) => {
        console.log(reimbursementItemObject);
        return new Promise((resolve, reject) => {
            let query = `
            INSERT INTO flex_reimbursement_detail(flex_reimbursement_id, or_number, name_of_establishment, tin_of_establishment, amount, category_id, status, date_added)
            VALUES(${reimbursementItemObject.reimbursementId}, '${reimbursementItemObject.orNumber}', '${reimbursementItemObject.establishmentName}', '${reimbursementItemObject.establishmentTin}', ${reimbursementItemObject.amount}, '${reimbursementItemObject.categoryId}', 'Draft', '${reimbursementItemObject.date}')`;
            connectionPool.query(query, (error, results) => {
                if (error) {
                    console.log(error)
                    return reject(error);
                } else {
                    return resolve(results.insertId);
                    
                }
            });
        })
    },
    getReimbursementItemById : async (id) => {
        return new Promise( (resolve, reject) => {
            let query = `
            SELECT * FROM flex_reimbursement_detail  
            WHERE flex_reimbursement_detail_id  = ${id};
            `
            connectionPool.query(query, (error, results, fields) => {
                if (error) {
                    console.log(error)
                    reject (error)
                } else {
                    resolve (results);
                }
            });
        });
    },
    deleteReimbursementItemById : async (id) =>{
        return new Promise((resolve, reject) => {
            let query = `
            DELETE FROM flex_reimbursement_detail WHERE flex_reimbursement_detail_id = ${id}`;
            connectionPool.query(query, (error, result) => {
                if (error) {
                    console.log(error)
                    reject (error)
                } else {
                    resolve (result.affectedRows);
                }
            });
        } );
    }

}

module.exports = reimbursementItemRepository;