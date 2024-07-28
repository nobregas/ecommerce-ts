import { HttpStatus } from "../enums/httpstatus";
import { HttpException } from "./root";

export class InternalException extends HttpException {
    constructor(message:string, errors:any, errorCode:number) {
        super(message, errorCode, HttpStatus.INTERNAL_SERVER_ERROR, errors);
    }
}