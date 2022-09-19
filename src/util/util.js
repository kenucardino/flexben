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
    }
}

module.exports = util