module.exports.JWT_OPTIONS = {
    CUSTOMER_AUDIENCE : ["SEARCH_FILM", "SEARCH_ACTOR"],
    STAFF_AUDIENCE : ["SEARCH_ALL_FILM", "SEARCH_ACTOR", "ADD_FILM", "UPDATE_FILM", "DELETE_FILM", "ADD_ACTOR", "UPDATE_ACTOR", "DELETE_ACTOR", "SEARCH_CUSTOMER", "SEARCH_RENTAL", "UPDATE_RENTAL"]
}

module.exports.AUDIENCE = {
    ADD_FILM : "ADD_FILM",
    UPDATE_FILM : "UPDATE_FILM",
    DELETE_FILM : "DELETE_FILM",
    ADD_ACTOR : "ADD_ACTOR",
    UPDATE_ACTOR : "UPDATE_ACTOR",
    DELETE_ACTOR : "DELETE_ACTOR",
    SEARCH_CUSTOMER : "SEARCH_CUSTOMER",
    SEARCH_ALL_FILM : "SEARCH_ALL_FILM",
    SEARCH_FILM : "SEARCH_FILM",
    SEARCH_ACTOR : "SEARCH_ACTOR",
    SEARCH_RENTAL : "SEARCH_RENTAL",
    UPDATE_RENTAL : "UPDATE_RENTAL"
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
            "code" : "INTERNAL_SERVER_ERROR",
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
    }
}