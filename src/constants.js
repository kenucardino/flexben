module.exports.PAYLOAD_ERRORS = {
    INVALID_AMOUNT : "INVALID_AMOUNT", 
    INVALID_DATE : "INVALID_DATE", 
    INVALID_CUT_OFF : "INVALID_CUT_OFF", 
    INTERNAL_SERVER_ERROR : "INTERNAL_SERVER_ERROR",
    INVALID_REIMBURSEMENT : "INVALID_REIMBURSEMENT"
}
module.exports.UPDATE_REIMBURSEMENT_OPERATION = {
    ADD : "ADD",
    DELETE : "DELETE"
}

module.exports.EMPLOYEE_AUDIENCE = {
    ADD_REIMBURSEMENT_ITEM : "ADD_REIMBURSEMENT_ITEM",
    DELETE_REIMBURSEMENT_ITEM : "DELETE_REIMBURSEMENT_ITEM",
    SUBMIT_REIMBURSEMENT : "SUBMIT_REIMBURSEMENT",
    PRINT_REIMBURSEMENT : "PRINT_REIMBURSEMENT",
    GET_ALL_CATEGORIES : "GET_ALL_CATEGORIES"
}

module.exports.HR_AUDIENCE = {
    GET_REIMBURSEMENTS : "GET_REIMBURSEMENTS",
    SEARCH_REIMBURSEMENT : "SEARCH_REIMBURSEMENT"
}

module.exports.ERR_RESPONSE = {
    INVALID_LOGIN : {
        "status" : 401,
        "statusText" : "Unauthorized",
        "message" : "Username or Password is incorrect.",
        "error" : {
            "code" : "UNAUTHORIZED",
            "message" : "Username or Password is incorrect."
        }
    },
    INVALID_TOKEN : {
        "status" : 401,
        "statusText" : "Unauthorized",
        "message" : "Please login.",
        "error" : {
            "code" : "UNAUTHORIZED",
            "message" : "Please login."
        }
    },
    INTERNAL_SERVER_ERROR : {
        "status" : 500,
        "statusText" : "Internal server error",
        "message" : "Error occured.",
        "error" : {
            "code" : "INTERNAL_SERVER_ERROR",
            "message" : "Error occured."
        }
    },
    FORBIDDEN : {
        "status" : 403,
        "statusText" : "FORBIDDEN",
        "message" : "Unauthorized access.",
        "error" : {
            "code" : "FORBIDDEN",
            "message" : "Unauthorized access."

        }
    },
    DUPLICATE_ENTRY : {
        "status" : 400,
        "statusText" : "BAD REQUEST",
        "message" : "Duplicate entry.",
        "error" : {
            "code" : "BAD_REQUEST",
            "message" : "Duplicate entry."

        }
    },BAD_REQUEST : {
        "status" : 400,
        "statusText" : "BAD REQUEST",
        "message" : "Invalid payload.",
        "error" : {
            "code" : "BAD_REQUEST",
            "message" : "Invalid payload."

        }
    },
    NOT_FOUND : {
        "status" : 404,
        "statusText" : "NOT FOUND",
        "message" : "Object searching not found.",
        "error" : {
            "code" : "NOT_FOUND",
            "message" : "Object searching not found."

        }
    },INVALID_CUT_OFF : {
        "status" : 400,
        "statusText" : "BAD REQUEST",
        "message" : "Invalid cutoff, check chosen cutoff if active.",
        "error" : {
            "code" : "BAD_REQUEST",
            "message" : "Invalid payload."

        }
    },INVALID_DATE : {
        "status" : 400,
        "statusText" : "BAD REQUEST",
        "message" : "Invalid date, date must be in the range of cutoff and should not be more than the current date.",
        "error" : {
            "code" : "BAD_REQUEST",
            "message" : "Invalid payload."

        }
    },INVALID_AMOUNT : {
        "status" : 400,
        "statusText" : "BAD REQUEST",
        "message" : "Invalid amount, amount must be within minimum and cap.",
        "error" : {
            "code" : "BAD_REQUEST",
            "message" : "Invalid payload."

        }
    }
}