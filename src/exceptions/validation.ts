import { ErrorCodes } from "../enums/errorcodes";
import { HttpStatus } from "../enums/httpstatus";
import { HttpException } from "./root";

export class UnProcessableEntity extends HttpException {
    constructor(error: any, message:string, errorCode:number){
        super(message, errorCode, HttpStatus.UNPROCESSABLE_ENTITY, error);
    }
}