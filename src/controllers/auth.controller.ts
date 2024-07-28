import { Response, Request, NextFunction } from "express";
import { prismaCLient } from "..";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCodes } from "../enums/errorcodes";
import { HttpStatus } from "../enums/httpstatus";
import { UnProcessableEntity } from "../exceptions/validation";
import { SignUpSchema } from "../schema/user.schema";
import { NotFoundException } from "../exceptions/not-found";



class AuthController {
    signup = async (req: Request, res: Response) => {
        SignUpSchema.parse(req.body);
            const {email, password, name} = req.body;
    
            let user = await prismaCLient.user.findFirst({where: {email}});
        
            if (user) throw new BadRequestException("User Already Exists", ErrorCodes.USER_ALREADY_EXISTS, null)
            
            user = await prismaCLient.user.create({
                data:{
                    name,
                    email,
                    password: hashSync(password, 10)
                }
            });
            res.status(HttpStatus.CREATED).json(user);
    }
    
    login = async (req: Request, res: Response) => {
    
        const {email, password} = req.body;
        let user = await prismaCLient.user.findFirst({where: {email}});
    
        if (!user) throw new NotFoundException("User not found", ErrorCodes.USER_NOT_FOUND)
        if (!compareSync(password, user.password)) throw new BadRequestException("Incorrect Login", ErrorCodes.INCORRECT_LOGIN, null)
        
        const token = jwt.sign({
            userId: user.id
        }, JWT_SECRET);
    
        res.json({
            user,
            token
        });
    }
    
    me = async (req: Request, res: Response) => {
    
        res.json(req.user);
    }
}

export default new AuthController();