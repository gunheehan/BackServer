class ApiResponse{
    static success(data, messsage = "Success"){
        return{
            success : true,
            message,
            data
        };
    }
    
    static error(message, code = "UNKNOWN_ERROR"){
        return{
            success: false,
            error:{
                message,
                code
            }
        }
    }
}

module.exports = ApiResponse;