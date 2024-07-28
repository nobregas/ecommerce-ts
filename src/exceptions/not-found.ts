import { ErrorCodes } from "../enums/errorcodes";
import { HttpStatus } from "../enums/httpstatus";
import { HttpException } from "./root";

export class NotFoundException extends HttpException {

    constructor(message:string, errorCode:ErrorCodes) {
        super(message, errorCode, HttpStatus.NOT_FOUND, null);
    }
}