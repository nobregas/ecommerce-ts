// message, statusCode, errorCode, error

import { ErrorCodes } from "../enums/errorcodes";

export class HttpException extends Error {

    message: string;
    
    errorCode: ErrorCodes;
    
    statusCode: number;
    
    errors: any;

    constructor(message:string, errorCode:ErrorCodes, statusCode:number, errors:any) {
        super(message);

        this.message=message;
        this.errorCode=errorCode;
        this.statusCode=statusCode;
        this.errors=errors;
    }
}

