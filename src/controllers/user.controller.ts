import { Request, Response } from "express";
import { AddressSchema, UpdateUserSchema } from "../schema/user.schema";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../enums/errorcodes";
import { Address, User } from "@prisma/client";
import { prismaCLient } from "..";
import { HttpStatus } from "../enums/httpstatus";


class UserController{
    addAddress = async(req: Request, res: Response) => {
        AddressSchema.parse(req.body);
    
    
        const address = await prismaCLient.address.create({
            data:{
                ...req.body,
                userId: req.user.id
            }
        })  
        res.status(HttpStatus.CREATED).json(address);
    }
    
    deleteAddress = async(req: Request, res: Response) => {
        try {   
            await prismaCLient.address.delete({
                where:{
                    id: +req.params.id
                }
            });
            res.status(HttpStatus.NO_CONTENT).json({success: true});
    
        } catch (err) {
            throw new NotFoundException("Address not found", ErrorCodes.ADDRESS_NOT_FOUND);
        }
    
    }
    
    listAddress = async(req: Request, res: Response) => {
        const addresses = await prismaCLient.address.findMany({
            where:{
                userId: req.user.id
            }
        });
    
        res.json(addresses);
    }
    
    updateUser = async(req: Request, res:Response) => {
        const validatedData = UpdateUserSchema.parse(req.body);
    
        let shippingAddress: Address;
        let billingAddress: Address;
    
        if (validatedData.defaultShippingAddress) {
            try {
    
                shippingAddress = await prismaCLient.address.findFirstOrThrow({
                    where:{
                        id: validatedData.defaultShippingAddress,
                        userId: req.user.id   
                    }
                })
            } catch(err) {
                throw new NotFoundException("Shipping Address not found", ErrorCodes.SHIPPING_ADDRESS_NOT_FOUND);
            }
        }
    
        if (validatedData.defaultBillingAddress) {
            try {
    
                billingAddress = await prismaCLient.address.findFirstOrThrow({
                    where:{
                        id: validatedData.defaultBillingAddress,
                        userId: req.user.id   
                    }
                })
        
            } catch(err) {
                throw new NotFoundException("Billing Address not found", ErrorCodes.BILLING_ADDRESS_NOT_FOUND);
            }
        }
    
        const updatedUser = await prismaCLient.user.update({
            where:{
                id: req.user.id
            },
            data: validatedData
        })
        res.json(updatedUser)
    
    }
    
    listUsers = async (req: Request, res:Response) => {
    
        let skip: number;
        
        if (req.params.skip) {
            skip = +req.params.skip;
        } else {
            skip = 0;
        }
        
        let take: number = 5;
    
        const count = await prismaCLient.user.count();
    
        const users = await prismaCLient.user.findMany({
            skip: skip,
            take: take
        })
    
        res.json({users, skip, take, count})
    }
    
    getUserById = async (req: Request, res:Response) => {
        try {
            const user = await prismaCLient.user.findFirstOrThrow({
                where:{
                    id: +req.params.id
                },
                include: {
                    addresses: true
                }
            });
            res.json(user);
    
        } catch(err) {
            throw new NotFoundException("User not found", ErrorCodes.USER_NOT_FOUND)
        }
    }
    
    changeUserRole = async (req: Request, res:Response) => {
        //TODO VALIDATE DATA
        try {
            const user = await prismaCLient.user.update({
                where:{
                    id: +req.params.id
                },
                data: {
                    role: req.body.role
                }
            });
            res.json(user);
    
        } catch(err) {
            throw new NotFoundException("User not found", ErrorCodes.USER_NOT_FOUND)
        }
    }
    
}

export default new UserController();