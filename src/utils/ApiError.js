class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        error=[],
        stack=""
    ){
        super(message)  //jab bhi me hum override karte h to super call krte h toh yha par humne super ke andar message send krdiya 
        this.statusCode=statusCode

    }
}
export {ApiError};