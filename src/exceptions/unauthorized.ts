import { ErrorCodes } from "../enums/errorcodes";
import { HttpStatus } from "../enums/httpstatus";
import { HttpException } from "./root";

export class UnauthorizedException extends HttpException {

    constructor(message:string, errorCode:ErrorCodes) {
        super(message, errorCode, HttpStatus.UNAUTHORIZED, null);
    }
}