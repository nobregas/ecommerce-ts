import { ErrorCodes } from "../enums/errorcodes";
import { HttpStatus } from "../enums/httpstatus";
import {  HttpException } from "./root";

export class BadRequestException extends HttpException {

    constructor(message:string, errorCode:ErrorCodes, error:any) {
        super(message, errorCode, HttpStatus.BADREQUEST, error);
    }

    
}