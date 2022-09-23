const { query } = require('express');
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
    },
    getReimbursementItemByReimbursementId : async (id) => {
        return new Promise( (resolve, reject) => {
            let query = `
            SELECT * FROM flex_reimbursement_detail  
            WHERE flex_reimbursement_id  = ${id};
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
    updateReimbursementItemStatusByReimbursementId : async (reimbursementId, status) => {
        return new Promise ((resolve, reject) => {
             let query = `
            UPDATE flex_reimbursement_detail 
            SET status = '${status}'
            WHERE flex_reimbursement_id = ${reimbursementId}
            `
            connectionPool.query(query, (error, results) => {
                if (error) {
                    console.log(error)
                    reject (error)
                } else {
                    resolve (results.affectedRows);
                }
            });
        });
    },
    getReimbursementItemByCategoryId : async (id) => {
        return new Promise ((resolve, reject) => {
            let query = `
            SELECT * FROM flex_reimbursement_detail
            WHERE category_id  = ${id};
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
    getCategoriesWithReimbursementItems : async (reimbursementItemId) => {
        return new Promise((resolve, reject) => {
            let query = `
            SELECT c.category_id, c.name, frd.flex_reimbursement_detail_id, frd.flex_reimbursement_id, frd.date_added, frd.or_number,  frd.name_of_establishment, frd.tin_of_establishment, frd.amount, frd.status 
            FROM category AS c 
            LEFT JOIN flex_reimbursement_detail as frd ON frd.category_id = c.category_id 
            WHERE frd.flex_reimbursement_detail_id IS NULL OR frd.flex_reimbursement_id = ${reimbursementItemId}
            ORDER BY c.category_id;
            `
            connectionPool.query(query, (error, results, fields) => {
                if (error) {
                    console.log(error)
                    reject (error)
                } else {
                    resolve (results);
                }
            });
        })
    }
    
}

module.exports = reimbursementItemRepository;