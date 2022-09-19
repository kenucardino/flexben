const validateDate = require('validate-date');
const cutOffRepository = require('../repository/cutoffRepository');
const categoryRepository = require('../repository/categoryRepository');
const reimbursementRepository = require('../repository/reimbursementRepository');
const reimbursementItemRepository = require('../repository/reimbursementItemRepository');
const util = require('../util/util');
const constants = require('../constants');


let reimbursementService = {
    addReimbursementItem : async (employeeId, reimbursementItemObject, cutOffId) => {
        try {
            return new Promise(async (resolve, reject) => {
                let cutOff = await cutOffRepository.getCutOffById(cutOffId);
                let startDate = new Date(cutOff.start_date);
                let endDate = new Date(cutOff.end_date);
                let minimumAmoount = cutOff.cut_off_minimum_amount;
                let capAmount = cutOff.cut_off_cap_amount;
                let dateAdded = new Date(reimbursementItemObject.date);
                let amount = reimbursementItemObject.amount;
                let currentDate = new Date()
                //check if  cutoff is active
                if (cutOff.is_active == 'y'){
                    //check cutoff date, cutoff date range,
                    if (dateAdded > startDate && dateAdded < endDate && dateAdded < currentDate){
                        // check amount range
                        if(amount > minimumAmoount && amount < capAmount){
                            try{
                                //check if there is existing draft reimbursement
                                let reimbursement = await reimbursementRepository.getInDraftReimbursementByEmployeeId(employeeId);
                                let createdItems = {};
                                let updatedReimbursement = {}
                                if (reimbursement == '') {
                                    try{
                                    //build Reimbursment Object
                                    let reimbursementObject = util.reimbursementObjectBuilder(employeeId, cutOffId, amount)
                                    console.log(reimbursementObject)
                                    //create reimbursement and assign id in reimbursement item
                                    let newReimbursementId  = await reimbursementRepository.addReimbursement(reimbursementObject);
                                    console.log("new reimbursement id: " +newReimbursementId)
                                    reimbursementItemObject.reimbursementId = newReimbursementId;
                                    reimbursement = await reimbursementRepository.getReimbursementById(newReimbursementId);
                                    createdItems.reimbursement = reimbursement;
                                    
                                    } catch (error){
                                        console.log(error)
                                    }
                                } else {
                                    try {
                                        reimbursementItemObject.reimbursementId = reimbursement[0].flex_reimbursement_id;
                                    } catch (error) {
                                        
                                        console.log(error)
                                    }

                                }
                                let category = await categoryRepository.getByCode(reimbursementItemObject.categoryCode);
                                reimbursementItemObject.categoryId = category[0].category_id;
                                reimbursementItemObject.date = dateAdded.toISOString().slice(0, 19).replace('T', ' ') ;
                                let reimbursementItemId = await reimbursementItemRepository.addReimbursementItem(reimbursementItemObject);
                                //get created reimbursement item
                                let newReimbursementItem = await reimbursementItemRepository.getReimbursementItemById(reimbursementItemId);

                                reimbursement[0].total_reimbursement_amount = parseFloat(reimbursement[0].total_reimbursement_amount) + parseFloat(amount);
                                console.log(reimbursement)
                                let updatedAffectedRows = await reimbursementRepository.updateReimbursement(reimbursement[0]);
                                updatedReimbursement.affectedRows = updatedAffectedRows;
                                createdItems.updatedReimbursement = updatedReimbursement;
                                
                                createdItems.reimbursementItem = newReimbursementItem;
                                if(reimbursementItemId !=0){
                                    resolve(createdItems);
                                }else {
                                    reject("INTERNAL_SERVER_ERROR");
                                }
                            }catch (error){
                                reject(error);
                            }
                        }else {
                            reject("INVALID_AMOUNT");
                        }
                    } else {
                            reject("INVALID_DATE");
                    }
                } else {
                    reject("INVALID_CUT_OFF");
                }
                    
            });
        } 
        catch (error) {
            console.log(error)
            return  error;
        }
    },

    deleteReimbursementItem : async (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                //check if existing and if draft
                let reimbursementItem = await reimbursementItemRepository.getReimbursementItemById(id);
                if (reimbursementItem !='') {
                    console.log(reimbursementItem)
                    if (reimbursementItem[0].status == 'Draft') {
                        let affectedRows = await reimbursementItemRepository.deleteReimbursementItemById(id);
                        resolve(affectedRows);
                    } else {
                        resolve('NOT_DRAFT')
                    }
                } else {
                    resolve('NO_CONTENT')
                }
            } catch (error) {
                console.log(error);
                reject(error);
            }
        })

    }
}


module.exports = reimbursementService;