const AppError=require('./error-handler');
const {StatusCodes}=require('http-status-codes');

class validationError extends AppError{
    constructor(error){
        let errorname=error.name;
        let explanation=[];
        error.errors.forEach((err)=>{
            explanation.push(err.message);
        });

        super(
            errorname,
            'Not able to validate the data sent in the req',
            explanation,
            StatusCodes.BAD_REQUEST
        )
    }
}

module.exports=validationError;
