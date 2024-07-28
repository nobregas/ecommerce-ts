import { Response, Request } from "express";
import { prismaCLient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../enums/errorcodes";
import { HttpStatus } from "../enums/httpstatus";
import { PrismaClient } from "@prisma/client";


class ProductController {
    createProduct = async(req: Request, res: Response) => {

        const product = await prismaCLient.product.create({
            data: {
                ...req.body,
                tags: req.body.tags.join(",")
            }
        })
        res.status(HttpStatus.CREATED).json(product);
    }
    
   updateProduct = async(req: Request, res: Response) => {
        try {
            const product = req.body;
            if (product.tags) product.tags = product.tags.join(",")
    
            const updateProduct = await prismaCLient.product.update({
                where: {
                    id: +req.params.id
                },
                data: product
            })
    
            res.json(updateProduct);
    
        } catch (err) {
            throw new NotFoundException("Product not found", ErrorCodes.PRODUCT_NOT_FOUND)
        }
        
    }
    
    deleteProduct = async(req: Request, res: Response) => {
        try {
            await prismaCLient.product.delete({
                where:{
                    id: +req.params.id
                }
            })
        } catch (err) {
            throw new NotFoundException("Product not found", ErrorCodes.PRODUCT_NOT_FOUND);
        }
        
    }
    
    listProduct = async(req: Request, res: Response) => {
        
        let take = 5;
        let skip:number;
    
        if (req.query.skip) {
            skip = +req.query.skip
        } else {
            skip = 0;
        }
    
        const count = await prismaCLient.product.count()
        const products = await prismaCLient.product.findMany({
            skip: skip,
            take: take
        })
    
        res.json({
            count, take, skip, data:products,
        })
        
    }
    
    getProductById = async(req: Request, res: Response) => {
        try {
    
           const product = await prismaCLient.product.findFirstOrThrow(
            {
                where: {
                    id: +req.params.id
                }
            });
    
            res.json(product);
    
        } catch(err) {
            throw new NotFoundException("Product not found", ErrorCodes.PRODUCT_NOT_FOUND)
        }
        
    }
    
    searchProducts = async(req: Request, res: Response) => {
        // Cant work prisma bug...
    
        const products = await prismaCLient.product.findMany({
            where:{
                name: {
                    search: req.query.q!.toString()
                },
                description: {
                    search: req.query.q!.toString()
                },
                tags: {
                    search: req.query.q!.toString()
                },
            }
        })
        res.status(501).json("Not implemented yet, prisma bug :(");
    }
}

export default new ProductController();