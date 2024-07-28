import { Request, Response } from "express";
import { prismaCLient } from "..";
import { HttpStatus } from "../enums/httpstatus";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCodes } from "../enums/errorcodes";
import { NotFoundException } from "../exceptions/not-found";

export const createOrder = async(req: Request, res: Response) => {

    return await prismaCLient.$transaction(async(tx) => {

        const cartItens = await tx.cartItem.findMany({
            where:{
                userId: req.user.id
            },
            include:{
                product:true
            }
        });

        if (cartItens.length == 0) 
            throw new BadRequestException("The cart is empty", ErrorCodes.EMPTY_CART, null);
        
        const price = cartItens.reduce((prev, current) => {
            return prev + (current.quantity * +current.product.price)
        }, 0)

        const address = await tx.address.findFirst({
            where:{
                id: req.user.defaultShippingAddress!
            }
        })

        const order = await tx.order.create({
            data: {
                userId: req.user.id,
                netAmount: price,
                address: address!.formattedAddress,
                products: {
                    create: cartItens.map((cart) => {
                        return {
                            productId: cart.productId,
                            quantity: cart.quantity
                        }
                    })
                }
            }
        })
        
        const orderEvent = await tx.orderEvent.create({
            data:{
                orderId: order.id,
            }
        })
        await tx.cartItem.deleteMany({
            where:{
                userId: req.user.id
            }
        })
        return res.status(HttpStatus.CREATED).json(order);
    });
    
}

export const listOrders = async(req: Request, res: Response) => {
    const orders = await prismaCLient.order.findMany({
        where:{
            userId: req.user.id
        }
    });

    res.json(orders);
}

export const cancelOrder = async(req: Request, res: Response) => {
    
    // TODO WRAP INSIDE TRANSACTION
    try {
        const order = await prismaCLient.order.update({
            where:{
                id: +req.params.id,
                userId: req.user.id
            },
            data: {
                status: "CANCELLED"
            }
        });

        await prismaCLient.orderEvent.create({
            data: {
                orderId: order.id,
                status: "CANCELLED"
            }
        });
        
        res.json(order);

    } catch(err) {
        throw new NotFoundException("Order not found", ErrorCodes.ORDER_NOT_FOUND)
    }
}

export const getOrderById = async(req: Request, res: Response) => {
    try {
        const order = await prismaCLient.order.findFirstOrThrow({
            where:{
                id: +req.params.id,
                userId: req.user.id
            },
            include:{
                products:true,
                events:true
            }
        });
        
        res.json(order);

    } catch(err) {
        throw new NotFoundException("Order not found", ErrorCodes.ORDER_NOT_FOUND)
    }
}

export const listAllOrders = async (req: Request, res:Response) => {
    let whereClause = {};
    const status = req.params.status;

    if (status) {
        whereClause = {
            status
        };
    }
    
    let take = 5;

    let skip:number = 0;

    if (req.params.skip) skip = +req.params.skip;

    const count = await prismaCLient.order.count();

    const orders = await prismaCLient.order.findMany({
        where: whereClause,
        skip: skip,
        take: take
    });

    res.json({orders, skip, take, count});
}

export const changeStatus = async (req: Request, res:Response) => {
    //todo wrap to transaction, validate body
    try {
        const order = await prismaCLient.order.update({
            where:{
                id: +req.params.id,
            },
            data: {
                status: req.body.status
            }
        });
        await prismaCLient.orderEvent.create({
            data: {
                orderId: order.id,
                status: req.body.status
            }
        })
        res.json(order);

    } catch(err) {
        throw new NotFoundException("Order not found", ErrorCodes.ORDER_NOT_FOUND)
    }
}

export const listUserOrders = async (req: Request, res:Response) => {
    let whereClause:any = {
        userId: +req.params.id
    };
    const status = req.params.status;

    if (status) {
        whereClause = {
            ...whereClause,
            status
        };
    }
    
    let take = 5;

    let skip:number = 0;

    if (req.params.skip) skip = +req.params.skip;

    const count = await prismaCLient.order.count();

    const orders = await prismaCLient.order.findMany({
        where: whereClause,
        skip: skip,
        take: take
    });

    res.json({orders, skip, take, count});
}
