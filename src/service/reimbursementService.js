const validateDate = require('validate-date');
const cutOffRepository = require('../repository/cutoffRepository');
const categoryRepository = require('../repository/categoryRepository');
const reimbursementRepository = require('../repository/reimbursementRepository');
const reimbursementItemRepository = require('../repository/reimbursementItemRepository');
const util = require('../util/util');
const constants = require('../constants');
const fs = require('fs/promises');
const { resolve } = require('path');

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
                                    //create reimbursement and assign id in reimbursement item
                                    let newReimbursementId  = await reimbursementRepository.addReimbursement(reimbursementObject);
                                    reimbursementItemObject.reimbursementId = newReimbursementId;
                                    reimbursement = await reimbursementRepository.getReimbursementById(newReimbursementId);
                                    createdItems.reimbursement = reimbursement;
                                    
                                    } catch (error){
                                        console.log(error)
                                    }
                                } else {
                                    try {
                                        //update total amount
                                        let updatedAffectedRows = await reimbursementService.updateReimbursement(reimbursement, amount, constants.UPDATE_REIMBURSEMENT_OPERATION.ADD);
                                        updatedReimbursement.affectedRows = updatedAffectedRows;
                                        createdItems.updatedReimbursement = updatedReimbursement;
                                        reimbursementItemObject.reimbursementId = reimbursement[0].flex_reimbursement_id;
                                    } catch (error) {
                                        
                                        console.log(error)
                                    }

                                }
                                let category = await categoryRepository.getByCode(reimbursementItemObject.categoryCode);
                                reimbursementItemObject.categoryId = category[0].category_id;
                                reimbursementItemObject.date = dateAdded.toISOString().slice(0, 19).replace('T', ' ');
                                let reimbursementItemId = await reimbursementItemRepository.addReimbursementItem(reimbursementItemObject);
                                //get created reimbursement item
                                let newReimbursementItem = await reimbursementItemRepository.getReimbursementItemById(reimbursementItemId);


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
                    if (reimbursementItem[0].status == 'Draft') {
                        let affectedRows = await reimbursementItemRepository.deleteReimbursementItemById(id);
                        let reimbursement = await reimbursementRepository.getReimbursementById(reimbursementItem[0].flex_reimbursement_id )
                                //update total amount
                        let updatedRows = await reimbursementService.updateReimbursement(reimbursement ,reimbursementItem[0].amount, constants.UPDATE_REIMBURSEMENT_OPERATION.DELETE);
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

    },
    updateReimbursement : async (reimbursement, amount, operation) => {
        return new Promise(async (resolve, reject) =>{
            try{
                let reimbursementTotalAmount = parseFloat(reimbursement[0].total_reimbursement_amount);
                let parsedAmount = parseFloat(amount);
                if(operation == constants.UPDATE_REIMBURSEMENT_OPERATION.ADD) {
                    reimbursement[0].total_reimbursement_amount = reimbursementTotalAmount + parsedAmount;
                }else if (operation == constants.UPDATE_REIMBURSEMENT_OPERATION.DELETE) {
                    reimbursement[0].total_reimbursement_amount = reimbursementTotalAmount - parsedAmount;
                }
                resolve(reimbursementRepository.updateReimbursement(reimbursement[0])); 
            }catch (error) {
                console.log(error);
                reject(error);
            }
        });

    },
    submitReimbursement : async (id) => {
        return new Promise (async (resolve, reject) =>{
            let reimbursement = await reimbursementRepository.getReimbursementById(id);
            if(reimbursement != '' && typeof reimbursement != 'undefined'){
                let cutOff = await cutOffRepository.getCutOffById(reimbursement[0].flex_cut_off_id);
                let capAmount = cutOff.cut_off_cap_amount;
                //Check if total amount is <= capamount
                if(capAmount >= reimbursement[0].total_reimbursement_amount){
                    let dateSubmitted = new Date().toISOString().slice(0, 19).replace('T', ' ');
                    let transactionNumber = await reimbursementService.generateTransactionNumber(id, dateSubmitted)
                    reimbursement[0].transaction_number = transactionNumber;
                    reimbursement[0].status = "Submitted";
                    reimbursement[0].date_submitted = dateSubmitted
                    let affectedReimbursement = await reimbursementRepository.updateReimbursement(reimbursement[0]);
                    let affectedItems = await reimbursementItemRepository.updateReimbursementItemStatusByReimbursementId(id, "Submitted")

                    resolve({result : { reimbursementId : id, numberOfSubmmittedItems : affectedItems }})
                }else {
                    reject("CAP reached")
                }
            }else {
                reject(constants.PAYLOAD_ERRORS.INVALID_REIMBURSEMENT)
            }
        });
    },
    generateTransactionNumber :  (id, dateSubmitted) => {
        return new Promise (async (resolve, reject) =>{
            try{
                    let result = await reimbursementRepository.getReimbursementAndDetailsById(id);
                    let companyCode = result[0].code.toString();
                    let cutOffId = result[0].flex_cycle_cutoff_id.toString();
                    let reimbursementId = result[0].flex_reimbursement_id.toString();
                    let year = new Date(dateSubmitted).getFullYear();
                    let month = new Date(dateSubmitted).getMonth();
                    let date = new Date(dateSubmitted).getDate();
                    dateSubmitted = year+''+month+''+date;
                    let transactionNumer = companyCode +"-"+ cutOffId +"-"+ dateSubmitted +"-"+ reimbursementId
                    resolve (transactionNumer);
            }catch (error) {
                reject(error);
            }
        });
    },
    printReimbursement: async (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                let reimbursementAndDetails = await reimbursementRepository.getReimbursementAndDetailsById(id);
                let reimbursement = reimbursementAndDetails[0];
                if(reimbursement != '' && typeof reimbursement != 'undefined') {
                    const header = util.documentHeaderBuilder(reimbursement);
                    let results = await reimbursementItemRepository.getCategoriesWithReimbursementItems(reimbursement.flex_reimbursement_id);
                    const body = util.documentBodyBuilder(results);
                    const content = header + '\n' + body;
                    // resolve(content);
                    const fileName = await util.generateReimbursementFile(reimbursement, content)
                    resolve(fileName);
                } else {
                    reject(constants.PAYLOAD_ERRORS.INVALID_REIMBURSEMENT)
                }
                // res.sendFile(fileName)
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });

    },
    getAllReimbursementsOrderByStatus : (status, cutOffId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let reimbursements = await reimbursementRepository.getAllReimbursmentsSortByStatus(status, cutOffId);
                resolve(reimbursements);
            } catch (error) {
                console.log(error)
                reject(error);
            }
        });
    },
    getReimbursementandItmesById : (reimbursementId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const reimbursement = await reimbursementRepository.getReimbursementById(reimbursementId);
                const reimbursementItems = await reimbursementItemRepository.getReimbursementItemByReimbursementId(reimbursement[0].flex_reimbursement_id);
                resolve(util.reimbursementAndItemsResponseBuilder(reimbursement[0], reimbursementItems))
            } catch (error) {
                console.log(error)
                reject(error);
            }
        });
    },
    searchReimbursementByKeywords : (searchKeywordsObject) => {
        return new Promise(async (resolve, reject) =>{
            try {
                let result=[];
                const reimbursements = await reimbursementRepository.searchReimbursement(searchKeywordsObject);
                for (const reimbursement of reimbursements) {
                    let reimbursementItems = await reimbursementItemRepository.getReimbursementItemByReimbursementId(reimbursement.flex_reimbursement_id);
                    let formattedReimbursement = util.reimbursementAndItemsResponseBuilder(reimbursement, reimbursementItems)
                    result.push(formattedReimbursement)   
                }
                console.log("end")
                resolve(result);
            } catch (error) {
                console.log(error)
                reject(error);
            }
        })
    },
    decideReimbursement : (reimbursementId, action) => {
        return new Promise(async (resolve, reject) => {
            if(action == constants.REIMBURSEMENT_DECISTION.APPROVE || action == constants.REIMBURSEMENT_DECISTION.REJECT){
                let reimbursement = await reimbursementRepository.getReimbursementById(reimbursementId);
                console.log(reimbursement)
                if(reimbursement != '' && typeof reimbursement !='undefined'){
                    if(reimbursement[0].status == "Submitted"){
                        if(action == constants.REIMBURSEMENT_DECISTION.APPROVE){
                            reimbursement[0].status = "Approved"
                        } else if (action == constants.REIMBURSEMENT_DECISTION.REJECT){
                            reimbursement[0].status = "Rejected"
                        }
                        console.log("pasok")
                        let affectedRole = await reimbursementRepository.updateReimbursement(reimbursement[0]);
                        let affectedItems = await reimbursementItemRepository.updateReimbursementItemStatusByReimbursementId(reimbursement[0].flex_reimbursement_id, reimbursement[0].status);
                        resolve({affectedReimbursement : affectedRole, affectedItems : affectedItems});
                    }else reject("NOT_DRAFT")
                }else reject(constants.PAYLOAD_ERRORS.BAD_REQUEST);
            }else reject(constants.PAYLOAD_ERRORS.BAD_REQUEST);
        });
    }
}


module.exports = reimbursementService;