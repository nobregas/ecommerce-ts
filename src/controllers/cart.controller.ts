import { Request, Response } from "express";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../enums/errorcodes";
import { prismaCLient } from "..";
import { HttpStatus } from "../enums/httpstatus";
import { ChangeQuantitySchema, CreateCartSchema } from "../schema/cart.schema";
import { CartItem, Product } from "@prisma/client";

export const addItemToCart = async(req: Request, res: Response) => {

    //TODO check if is adding an existing product
    const validatedData = CreateCartSchema.parse(req.body);

    let product: Product;

    try {
        product = await prismaCLient.product.findFirstOrThrow({
            where:{
                id: validatedData.productId
            }
        })
    } catch(err) {
        throw new NotFoundException("Product not found", ErrorCodes.PRODUCT_NOT_FOUND)
    }
    
    const cart = await prismaCLient.cartItem.create({
        data:{
            userId: req.user.id,
            productId: product.id,
            quantity: validatedData.quantity
        }
    })
    res.status(HttpStatus.CREATED).json(cart);
}

export const deleteItemFromCart = async(req: Request, res: Response) => {
   await prismaCLient.cartItem.delete({
    where:{
        id: +req.params.id,
        userId: req.user.id
    }
   })
   res.status(HttpStatus.NO_CONTENT).json();
}

export const changeQuantity = async(req: Request, res: Response) => {
    const validatedData = ChangeQuantitySchema.parse(req.body);

    const updatedCart = await prismaCLient.cartItem.update({
        where:{
            id:+req.params.id,
            userId: req.user.id
        },
        data: {
            quantity: validatedData.quantity
        }
    }).catch((err) => {
        throw new NotFoundException("Cart not found", ErrorCodes.CART_NOT_FOUND)
    })
    res.json(updatedCart)
}

export const getCart = async(req: Request, res: Response) => {
   const cart = await prismaCLient.cartItem.findMany({
        where:{
            userId: req.user.id
        },
        include:{
            product:true
        }
   });
   res.json(cart);
}
