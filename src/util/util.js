
const fs = require('fs/promises');


let util = {
    successResponseBuilder : (status, statusText, message, data) => {
        return {
            message : {
                status : status,
                statusText : statusText,
                message : message,
                data : data
            }
        }
    },

    reimbursementObjectBuilder : (employeeId, cutOffId, totalReimbursementAmount) => {
         let reimbursmentObject = {
            employeeId : employeeId,
            cutOffId : cutOffId,
            totalReimbursementAmount : totalReimbursementAmount,
            dateSubmitted : "null",
            status : "Draft",
            dateUpdated : new Date().toISOString().slice(0, 19).replace('T', ' '),
            transactionNumber : "null"
        }
    return reimbursmentObject;
    },

    documentHeaderBuilder : (reimbursementObject) => {
        let employeeName = reimbursementObject.last_name + ", "+ reimbursementObject.first_name;
        let employeeNumber = reimbursementObject.employee_number;
        let dateSubmitted = reimbursementObject.date_submitted;
        const monthArray = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        let year = new Date(dateSubmitted).getFullYear();
        let month = monthArray[new Date(dateSubmitted).getMonth()]
        let date = new Date(dateSubmitted).getDate();
        dateSubmitted = month+', '+ date + ' ' + year;
        let transactionNumber = reimbursementObject.transaction_number;
        let amount = reimbursementObject.total_reimbursement_amount;
        let status = reimbursementObject.status;
        let header = `Employee Name: ${employeeName}\nEmployee Number: ${employeeNumber}\nDate Submitted: ${dateSubmitted}\nTransaction Number: ${transactionNumber}\nAmount: PHP${amount}\nStatus: ${status}`;
        return header;
    },
    documentBodyBuilder : (categoriesWithItems) => {
        let body ="=== DETAILS ===\n"
        let holder = 0;
        categoriesWithItems.forEach(category => {
            if (category.flex_reimbursement_detail_id == null){
                body += `CATEGORY:  ${category.name}\nN/A\n\n`  ;
            } else{
                if (holder == 0){
                    holder++;
                    body += `CATEGORY:  ${category.name}\nITEM # ${holder}\nDate: ${category.date_added}\nOR Number: ${category.or_number}\nName of Establishment: ${category.name_of_establishment}\nTIN of Establishment: ${category.tin_of_establishment}\nAmount: PHP${category.amount}\nStatus: ${category.status}\n\n`;
                }else{
                    holder++;
                    body += `ITEM # ${holder}\nDate: ${category.date_added}\nOR Number: ${category.or_number}\nName of Establishment: ${category.name_of_establishment}\nTIN of Establishment: ${category.tin_of_establishment}\nAmount: PHP${category.amount}\nStatus: ${category.status}\n\n`;
                }


            }
        });
        return body;
    },
    generateReimbursementFile : async (reimbursementObject, content) => {
        const directory =  process.cwd()+"\\src\\temp\\reimbursements"
        const employeeName = reimbursementObject.last_name + "_"+ reimbursementObject.first_name;
        const fileName =  directory + "\\" +employeeName + "_" + reimbursementObject.transaction_number + ".txt";
        try {
            await fs.writeFile(fileName, content);
            console.log("Files saved")
            return fileName;
        } catch (error) {
            return error
        }
        
    },
    reimbursementAndItemsResponseBuilder : (reimbursementObject, reimbursementItmes) =>{
        let reimbursementAndItems = {
            employeeNumber : reimbursementObject.employee_number,
            employeeName : `${reimbursementObject.last_name + ", " + reimbursementObject.first_name}`,
            dateSubmitted : reimbursementObject.date_submitted,
            reimbursementItems : [],
            totalReimbursementAmount : reimbursementObject.total_reimbursement_amount,
            status : reimbursementObject.status
        };
        
        reimbursementItmes.forEach(item => {
            let reimbursementItem = {
                Date : item.date_added,
                OrNumber : item.or_number,
                nameOfEstablishment : item.name_of_establishment,
                tinOfEstablishment : item.tin_of_establishment,
                amount : item.amount,
                status : item.status
            }
            reimbursementAndItems.reimbursementItems.push(reimbursementItem);
        });
        return reimbursementAndItems;
    }

}

module.exports = util