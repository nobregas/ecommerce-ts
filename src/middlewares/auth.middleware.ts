import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCodes } from "../enums/errorcodes";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { prismaCLient } from "..";

const authMiddleware = async(req: Request, res:Response, next: NextFunction) => {

    const token = req.headers.authorization
    if (!token) next(new UnauthorizedException("Unauthorized", ErrorCodes.UNAUTHORIZED))
    

    try {

        const payload = jwt.verify(token!, JWT_SECRET) as any;
        const user = await prismaCLient.user.findFirst({where: {id: payload.userId}})
        
        if (!user) next(new UnauthorizedException("Unauthorized", ErrorCodes.UNAUTHORIZED));

        req.user= user as any; 
        next();       
    
    } catch(err) {
        next(new UnauthorizedException("Unauthorized", ErrorCodes.UNAUTHORIZED));
    }

}

export default authMiddleware;