import { NextFunction, Request, Response } from "express"
import { HttpException } from "./exceptions/root"
import { InternalException } from "./exceptions/internal-exception"
import { ErrorCodes } from "./enums/errorcodes"
import { ZodError } from "zod"
import { BadRequestException } from "./exceptions/bad-request"

export const errorHandler = (method: Function) => {
    return async(req: Request, res: Response, next: NextFunction) => {
        try {
            await method(req, res, next)
        } catch(err: any) {

            let exception: HttpException;

            if (err instanceof HttpException) {
                exception = err;
            } else if (err instanceof ZodError) {
                exception = new BadRequestException("Unprocessable entity", ErrorCodes.UNPROCESSABLE_ENTITY, err)

            } else{
                exception = new InternalException("Somethins went wrong", err, ErrorCodes.INTERNAL_SERVER_ERROR);
            }
            next(exception);
        }
    }
}