import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { BookDetailType } from '../interfaces';
const bcrypt = require('bcryptjs');
import Book from '../models/book';
import BookDetail from '../models/bookDetail';
import { generateToken } from '../utils/JWT';

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { book, bookDetails } = req.body;

        const bookDetailIds: any[] = [];
        const newBookDetails: any[] = [];

        bookDetails.forEach((item: BookDetailType) => {
            const _id = new mongoose.Types.ObjectId();
            bookDetailIds.push(_id);

            const newBookDetail = new BookDetail({
                ...item,
                _id
            });

            newBookDetails.push(newBookDetail);
        });

        await BookDetail.insertMany(newBookDetails, { ordered: true });

        const newBook = new Book({
            ...book,
            bookDetailIds
        });

        const result = await newBook.save();

        return res.status(200).json({ book: result });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const findAllBooks = async (req: Request, res: Response, next: NextFunction) => {
    const { page } = req.query;

    try {
        const result = await Book.aggregate([
            {
                $addFields: {
                    id: { $toString: '$_id' },
                    customerObjectId: { $toObjectId: '$customerId' }
                }
            },
            {
                $lookup: {
                    from: 'customers',
                    localField: 'customerObjectId',
                    foreignField: '_id',
                    as: 'customer'
                }
            },
            {
                $unwind: '$customer'
            },
            {
                $facet: {
                    data: [{ $skip: (Number(page) - 1) * 10 }, { $limit: 10 }],
                    pagination: [{ $count: 'total' }]
                }
            }
        ]);

        return res.status(200).json({ data: result[0].data, pagination: result[0].pagination });
    } catch (error) {
        return res.status(500).json(error);
    }
};

const deleteBook = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    return Book.findByIdAndDelete(id)
        .then((book) => res.status(200).json({ book }))
        .catch((error) => res.status(500).json(error));
};

const findBookById = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    return Book.findById(id)
        .then((book) => res.status(200).json({ book }))
        .catch((error) => res.status(500).json({ error }));
};
const updateBook = (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    return Book.findByIdAndUpdate(data.id, { ...data }, { returnOriginal: false })
        .then((book) => res.status(200).json({ book }))
        .catch((error) => res.status(500).json({ error }));
};

export { findAllBooks, createBook, findBookById, updateBook, deleteBook };
