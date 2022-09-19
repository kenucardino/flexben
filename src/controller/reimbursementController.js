const reimbursementService = require('../service/reimbursementService');
const jwtService = require('../jwt/jwtService')
const constants = require('../constants');
const util = require('../util/util');

exports.addReimbursementItemController = async (req ,res) => {
    try {       
        let token = req.headers.authorization.split(" ")[1];
        if (jwtService.getAudienceFromToken(token).includes(constants.AUDIENCE.GET_ALL_CATEGORIES)){
            let reimbursementItemObejct = req.body.reimbursementItem;
            let cutOffId = req.body.cutOffId;
            let employeeEmail = jwtService.getUserNameFromToken(token);
            let currentUser = await jwtService.getUserByUserName(employeeEmail);
            
            let createdItems = await reimbursementService.addReimbursementItem(currentUser[0].employee_id, reimbursementItemObejct, cutOffId)
            res.send(util.successResponseBuilder(201, "CREATED", "Reimbursement item created", createdItems))
        }else res.status(403).send(constants.ERR_RESPONSE.FORBIDDEN)
    } catch (error) {
        console.log(error)
        if (Object.keys(constants.PAYLOAD_ERRORS).includes(error)) {
            switch (error) {
                case constants.PAYLOAD_ERRORS.INVALID_AMOUNT:
                    res.status(400).send(constants.ERR_RESPONSE.INVALID_AMOUNT)
                    break;
                case constants.PAYLOAD_ERRORS.INVALID_DATE:
                    res.status(400).send(constants.ERR_RESPONSE.INVALID_DATE)
                    break;
                case constants.PAYLOAD_ERRORS.INVALID_CUT_OFF:
                    res.status(400).send(constants.ERR_RESPONSE.INVALID_CUT_OFF)
                    break;
                case constants.PAYLOAD_ERRORS.INVALID_AMOUNT:
                    res.status(400).send(constants.ERR_RESPONSE.INVALID_AMOUNT)
                    break;
                default:
                    res.status(400).send(constants.ERR_RESPONSE.BAD_REQUEST)
                    break;
            }
        } else {
            res.status(500).send(constants.ERR_RESPONSE.INTERNAL_SERVER_ERROR)
        }
    }
}

exports.deleteReimbursementItem = async (req, res) => {
    try {
        if (jwtService.getAudienceFromToken(token).includes(constants.AUDIENCE.GET_ALL_CATEGORIES)){
            let id = req.query.id;
            if (id != '' && typeof id != 'undefined') {
                let result = await reimbursementService.deleteReimbursementItem(id);
                let statusCode, statusText, message, data;
                if (result == 'NOT_DRAFT') {
                    statusCode = 204;
                    statusText = 'No Content';
                    message = `Success request but Reimbursement ${id} is not in Draft status`;
                    data = ''
                } else if (result == 'NO_CONTENT') {
                    statusCode = 204;
                    statusText = 'No Content';
                    message = `Success request but Reimbursement ${id} does not exist`;
                    data = ''
                } else {
                    statusCode = 200;
                    statusText = "OK";
                    message = `Reimbursement Item ${id} Deleted`;
                    data = {affectedRows : result}
                    
                }
                res.send(util.successResponseBuilder(statusCode, statusText, message, {affectedRows : result}, data))
            } else {
                res.status(400).send(constants.ERR_RESPONSE.BAD_REQUEST);
            }
        }else res.status(403).send(constants.ERR_RESPONSE.FORBIDDEN)
        
    } catch (error) {
        console.log(error)
        res.status(500).send(constants.ERR_RESPONSE.INTERNAL_SERVER_ERROR)
    }
}

exports.submitReimbursement = async (req, res) => {
    try {
        if (jwtService.getAudienceFromToken(token).includes(constants.AUDIENCE.GET_ALL_CATEGORIES)){
            let id = req.query.id;
            if (id != '' && typeof id != 'undefined') {
                try {
                    
                let result = await reimbursementService.submitReimbursement(id);
                res.send(util.successResponseBuilder(200, "OK", `Reimbursement id ${result.reimbursementId} submitted`, result))
                } catch (error) {
                    console.log(error)
                    res.status(500).send(constants.ERR_RESPONSE.INTERNAL_SERVER_ERROR)
                }
            }else {
                res.status(400).send(constants.ERR_RESPONSE.BAD_REQUEST);
            }
        }else res.status(403).send(constants.ERR_RESPONSE.FORBIDDEN)
        
    } catch (error) {
        console.log(error)
        res.status(500).send(constants.ERR_RESPONSE.INTERNAL_SERVER_ERROR)
        
    }
}

exports.printtReimbursement = async (req, res) => {
    try {
        if (jwtService.getAudienceFromToken(token).includes(constants.AUDIENCE.GET_ALL_CATEGORIES)){
            let id = req.query.id;
            if (id != '' && typeof id != 'undefined') {
                try {
                    let result = await reimbursementService.printReimbursement(id);
                    res.send(result)
                } catch (error) {
                    console.log(error)
                    res.status(500).send(constants.ERR_RESPONSE.INTERNAL_SERVER_ERROR)
                }
            }else {
                res.status(400).send(constants.ERR_RESPONSE.BAD_REQUEST);
            }
        }else res.status(403).send(constants.ERR_RESPONSE.FORBIDDEN)
        
    } catch (error) {
        console.log(error)
        res.status(500).send(constants.ERR_RESPONSE.INTERNAL_SERVER_ERROR)
        
    }
}