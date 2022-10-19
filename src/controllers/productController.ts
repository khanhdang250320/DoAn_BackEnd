import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
const bcrypt = require('bcryptjs');
import Product from '../models/product';

const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = new Product({
            _id: new mongoose.Types.ObjectId(),
            ...req.body
        });

        const result = await product.save();

        return res.status(200).json({ product: result });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const findAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    const { page, status, limit, name } = req.query;

    try {
        const result = await Product.aggregate([
            {
                $addFields: {
                    id: { $toString: '$_id' },
                    productTypeObjectId: { $toObjectId: '$productTypeId' },
                    nameToLower: {
                        $toLower: '$name'
                    }
                }
            },
            {
                $match: {
                    ...(status ? { status: Number(status) } : {}),
                    ...(name
                        ? {
                              name: {
                                  $regex: name,
                                  $options: 'i'
                              }
                          }
                        : {})
                }
            },
            {
                $lookup: {
                    from: 'productTypes',
                    localField: 'productTypeObjectId',
                    foreignField: '_id',
                    as: 'productType'
                }
            },
            {
                $unwind: '$productType'
            },
            {
                $facet: {
                    data: [{ $skip: (Number(page) - 1) * 10 }, { $limit: limit ? Number(limit) : 10 }],
                    pagination: [{ $count: 'total' }]
                }
            }
        ]);

        return res.status(200).json({ data: result[0].data, pagination: result[0].pagination });
    } catch (error) {
        return res.status(500).json(error);
    }
};

const deleteProduct = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    return Product.findByIdAndDelete(id)
        .then((product) => res.status(200).json({ product }))
        .catch((error) => res.status(500).json(error));
};

const findProductById = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    return Product.findById(id)
        .then((product) => res.status(200).json({ product }))
        .catch((error) => res.status(500).json({ error }));
};

const updateProduct = (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    return Product.findByIdAndUpdate(data.id, { ...data }, { returnOriginal: false })
        .then((product) => res.status(200).json({ product }))
        .catch((error) => res.status(500).json({ error }));
};

export { findAllProducts, createProduct, findProductById, updateProduct, deleteProduct };
