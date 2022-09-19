const validateDate = require('validate-date');
const cutOffRepository = require('../repository/cutoffRepository');
const categoryRepository = require('../repository/categoryRepository');
const reimbursementRepository = require('../repository/reimbursementRepository');
const reimbursementItemRepository = require('../repository/reimbursementItemRepository');
const util = require('../util/util');
const constants = require('../constants');
const fs = require('fs');


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
                }else {
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
            if(reimbursement != ''){
                let cutOff = await cutOffRepository.getCutOffById(reimbursement[0].flex_cut_off_id);
                let capAmount = cutOff.cut_off_cap_amount;
                //Check if total amount is <= capamount
                if(capAmount >= reimbursement[0].total_reimbursement_amount){
                    let dateSubmitted = new Date().toISOString().slice(0, 19).replace('T', ' ');
                    let transactionNumber = await reimbursementService.generateTransactionNumber(id, dateSubmitted)
                    reimbursement[0].transaction_number = transactionNumber;
                    reimbursement[0].status = "Submitted";
                    reimbursement[0].date_submitted = dateSubmitted
                    console.log(reimbursement);
                    let affectedReimbursement = await reimbursementRepository.updateReimbursement(reimbursement[0]);
                    let affectedItems = await reimbursementItemRepository.updateReimbursementItemByReimbursementIdSubmit(id)

                    resolve({result : { reimbursementId : id, numberOfSubmmittedItems : affectedItems }})
                }else {
                    reject("CAP reached")
                }
            }else {
                //TODO REJECT ERROr
                reject(error)
            }
        });
    },
    generateTransactionNumber :  (id, dateSubmitted) => {
        return new Promise (async (resolve, reject) =>{
            try{
                    let result = await reimbursementRepository.getReimbursementAndDetails(id);
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
    printReimbursement : async (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await reimbursementRepository.getReimbursementAndDetails(id);
                let reimbursement = result[0];
                let employeeName = reimbursement.last_name + ", "+ reimbursement.first_name;
                let employeeNumber = reimbursement.employee_number;
                let dateSubmitted = reimbursement.date_submitted;
                const monthArray = ["January","February","March","April","May","June","July","August","September","October","November","December"];
                let year = new Date(dateSubmitted).getFullYear();
                let month = monthArray[new Date(dateSubmitted).getMonth()]
                let date = new Date(dateSubmitted).getDate();
                dateSubmitted = month+', '+ date + ' ' + year;
                let transactionNumber = reimbursement.transaction_number;
                let amount = reimbursement.total_reimbursement_amount;
                let status = reimbursement.status;
                var header = `Employee Name: ${employeeName}\nEmployee Number: ${employeeNumber}\nDate Submitted: ${dateSubmitted}\nTransaction Number: ${transactionNumber}\nAmount: PHP${amount}\nStatus: ${status}`;
                var body ="=== DETAILS ==="
                let categories = await categoryRepository.getAll();
                let reimbursementItems;
                categories.forEach(async category => {
                    try{
                        body += `\nCATEGORY: ${category.name}`;
                        reimbursementItems = await reimbursementItemRepository.getReimbursementItemByCategoryId(category.category_id);
                        header+="hallo"
                        console.log(category.name)
                        if(reimbursementItems ==''){
                            body.concat(body, "N/A")
                            console.log("N/A")
                        }else{
                            console.log(reimbursementItems)
                        }
                        let counter = 1;
                        body = body + `testing` 
                        if(reimbursementItems[0] != ''){
                            // console.log('testing')
                            body += "testing" 
                            reimbursementItems.forEach(item => {
                                body += `Item #${counter}
                                Date: ${item.date_added}
                                OR number: ${item.or_number}
                                Name of Establishment: ${item.name_of_establishment}
                                TIN of Establishment: ${item.tin_of_establishment}
                                Amount: Php${item.amount}
                                Status: ${item.status}
                                `
                                counter++
                            });
                            
                        }else {
                            body += "N/A"
                        }
                    }catch(error){
                        console.log(error)
                    }
                });
                // resolve(header)
                fs.appendFile(`${employeeName}reimbursement.txt`,header +'\n'+ body,  function (err) {
                    if (err) throw err;
                    console.log('Saved!');
                  });
                resolve(header +'\n'+ body)
    
            } catch (error) {
                console.log(error)
                reject(error);
            }
        } );
        
    }
}


module.exports = reimbursementService;