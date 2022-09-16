let util = {
    getResponseBuilder : (statusText, message, data) => {
        return {
            message : {
                status : 200,
                statusText : statusText,
                message : message,
                data : data
            }
        }
    }
}

module.exports = util