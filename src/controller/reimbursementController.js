const reimbursementService = require('../service/reimbursementService');
const jwtService = require('../jwt/jwtService')
const constants = require('../constants');
const util = require('../util/util');

exports.addReimbursementItemController = async (req ,res) => {
    try {
        let token = req.headers.authorization.split(" ")[1];
        let reimbursementItemObejct = req.body.reimbursementItem;
        let cutOffId = req.body.cutOffId;
        let employeeEmail = jwtService.getUserNameFromToken(token);
        let currentUser = await jwtService.getUserByUserName(employeeEmail);
        
        let createdItems = await reimbursementService.addReimbursementItem(currentUser[0].employee_id, reimbursementItemObejct, cutOffId)
        res.send(util.successResponseBuilder(201, "CREATED", "Reimbursement item created", createdItems))
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