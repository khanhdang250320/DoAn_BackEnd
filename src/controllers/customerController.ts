import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
const bcrypt = require('bcryptjs');
import Customer from '../models/customer';
import { generateToken } from '../utils/JWT';

const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customer = new Customer({
            _id: new mongoose.Types.ObjectId(),
            ...req.body
        });

        const result = await customer.save();

        return res.status(200).json({ customer: result });
    } catch (error) {
        return res.status(500).json({ error });
    }
};
// const findAllUser = async (req: Request, res: Response, next: NextFunction) => {
//     return User.find()
//         .then(async (users) => {
//             if (users.length === 0) return res.status(200).json({ users });
//             const result: any = [];
//             await users.forEach(async (user) => {
//                 console.log('first');
//                 const item = await getAccountById(user.accountId);
//                 result.push({
//                     id: user.id,
//                     name: user.name,
//                     age: user.age,
//                     createAt: user.createAt,
//                     account: {
//                         id: user.accountId,
//                         username: item?.username,
//                         password: item?.password,
//                         createAt: item?.createAt
//                     }
//                 });
//                 if (result.length === users.length) {
//                     res.status(200).json({ users: result });
//                 }
//             });
//         })
//         .catch((error) => res.status(500).json({ error }));
// };

// db.users.aggregate([{ $addFields: { accountObjectId: { $toObjectId: "$accountId" } } }, { $lookup: { from: "accounts", localField: "accountObjectId", foreignField: "_id", as: "account" } }, { $unwind: "$account" }, { $addFields: { "account.roleObjectId": { $toObjectId: "$account.roleId" } } }, { $lookup: { from: "roles", localField: "account.roleObjectId", foreignField: "_id", as: "account.role" } }, { $unwind: "$account.role" }])
const findAllCustomers = async (req: Request, res: Response, next: NextFunction) => {
    const { page } = req.query;

    try {
        const result = await Customer.aggregate([
            {
                $addFields: {
                    id: { $toString: '$_id' }
                }
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

const deleteCustomer = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    return Customer.findByIdAndDelete(id)
        .then((customer) => res.status(200).json({ customer }))
        .catch((error) => res.status(500).json(error));
};

const findCustomerById = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    return Customer.findById(id)
        .then((customer) => res.status(200).json({ customer }))
        .catch((error) => res.status(500).json({ error }));
};
const updateCustomer = (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    return Customer.findByIdAndUpdate(data.id, { ...data }, { returnOriginal: false })
        .then((customer) => res.status(200).json({ customer }))
        .catch((error) => res.status(500).json({ error }));
};

const findUserByUsernameAndPassword = (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    return Customer.aggregate([
        {
            $match: { username, password }
        },
        {
            $addFields: {
                roleObjectId: { $toObjectId: '$roleId' },
                id: '$_id'
            }
        },
        { $lookup: { from: 'roles', localField: 'roleObjectId', foreignField: '_id', as: 'role' } },
        { $unwind: '$role' },
        {
            $addFields: {
                'role.id': '$roleId'
            }
        },
        { $project: { roleObjectId: 0, roleId: 0, _id: 0, 'role._id': 0 } }
    ])
        .then(async (customers) => {
            const token = await generateToken(customers.at(0), process.env.TOKEN_SECRET_KEY, process.env.ACCESS_TOKEN_LIFE);
            console.log(token);
            res.status(200).json({
                customer: {
                    ...customers.at(0),
                    accessToken: token
                }
            });
        })
        .catch((error) => res.status(error).json({ error }));
};

export { findAllCustomers, createCustomer, findCustomerById, updateCustomer, deleteCustomer };
