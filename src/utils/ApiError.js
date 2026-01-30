class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        error=[],
        stack=""
    ){
        super(message)  //jab bhi me hum override karte h to super call krte h toh yha par humne super ke andar message send krdiya 
        this.statusCode=statusCode
        this.data=null
        this.message=message
        this.success=false
        this.errors=error
        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}
export {ApiError};