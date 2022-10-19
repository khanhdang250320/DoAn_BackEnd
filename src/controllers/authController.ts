// import { Request, Response, NextFunction } from 'express';
// import mongoose from 'mongoose';
// import User from '../models/user';
// import Role from '../models/role';
// import { generateToken, verifyToken } from '../utils/JWT';
// const bcrypt = require('bcryptjs');

// const SALT = process.env.SALT || '10';
// const registry = (req: Request, res: Response, next: NextFunction) => {
//     const { role } = req.params;
//     const data = req.body;
//     return User.findOne({ username: data.username })
//         .then((user) => {
//             if (user) {
//                 return res.status(409).json({ user: 'Username exists' });
//             } else {
//                 return Role.findOne({ name: role })
//                     .then((role) => {
//                         const salt = bcrypt.genSaltSync(parseInt(SALT));
//                         const hash = bcrypt.hashSync(data.password, salt);
//                         const user = new User({
//                             _id: new mongoose.Types.ObjectId(),
//                             ...data,
//                             password: hash,
//                             roleId: role?.id
//                         });
//                         return user
//                             .save()
//                             .then((user) => res.status(200).json({ user }))
//                             .catch((error) => res.status(500).json({ error }));
//                     })
//                     .catch((error) => res.status(500).json({ error }));
//             }
//         })
//         .catch((error) => res.status(500).json({ error }));
// };

// const login = (req: Request, res: Response, next: NextFunction) => {
//     const { role } = req.params;
//     const { username, password } = req.body;
//     return User.aggregate([
//         {
//             $addFields: {
//                 roleObjectId: { $toObjectId: '$roleId' },
//                 id: '$_id'
//             }
//         },
//         {
//             $lookup: {
//                 from: 'roles',
//                 localField: 'roleObjectId',
//                 foreignField: '_id',
//                 as: 'role'
//             }
//         },
//         {
//             $unwind: '$role'
//         },
//         {
//             $match: {
//                 'role.name': role,
//                 username
//             }
//         }
//     ])
//         .then(async (users) => {
//             if (!users) return res.status(200).json({ user: null });
//             else {
//                 const user = {
//                     ...users[0],
//                     refreshToken: ''
//                 };
//                 if (bcrypt.compareSync(password, user.password)) {
//                     const accessToken = await generateToken(user, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_LIFE);
//                     const refreshToken = await generateToken(user, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_LIFE);
//                     await User.findByIdAndUpdate(
//                         user.id,
//                         {
//                             ...user,
//                             refreshToken: refreshToken
//                         },
//                         { returnOriginal: false }
//                     );
//                     res.status(200).json({
//                         user: {
//                             ...user,
//                             accessToken: accessToken,
//                             refreshToken: refreshToken
//                         }
//                     });
//                 } else return res.status(200).json({ user: null });
//             }
//         })
//         .catch((error) => res.status(500).json({ error }));
// };

// const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
//     const { refreshToken } = req.body;
//     if (refreshToken) {
//         try {
//             const decoded = await verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
//             const accessToken = await generateToken(decoded, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_LIFE);
//             return res.status(200).json({ accessToken });
//         } catch (error) {
//             res.status(403).json({
//                 message: 'Invalid refresh token.'
//             });
//         }
//     } else {
//         return res.status(403).send({
//             message: 'No token provided.'
//         });
//     }
// };

// const changePassword = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = req.body;
//         const userById = await User.aggregate([
//             {
//                 $addFields: {
//                     id: { $toString: "$_id" }
//                 }
//             },
//             {
//                 $match: {
//                     id: data.id
//                 }
//             }
//         ]);
//         if (userById) {
//             if (bcrypt.compareSync(data.oldPassword, userById[0].password)) {
//                 const salt = bcrypt.genSaltSync(parseInt(SALT));
//                 const hash = bcrypt.hashSync(data.newPassword, salt);
//                 const newUser = {
//                     ...userById[0],
//                     password: hash
//                 }
//                 const accessToken = await generateToken(newUser, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_LIFE);
//                 const refreshToken = await generateToken(newUser, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_LIFE);
//                 await User.findByIdAndUpdate(
//                     newUser.id,
//                     {
//                         ...newUser,
//                         refreshToken: refreshToken
//                     },
//                     { returnOriginal: false }
//                 );
//                 return res.status(200).json({
//                     user: {
//                         ...newUser,
//                         accessToken: accessToken,
//                         refreshToken: refreshToken
//                     }
//                 });
//             } else {
//                 return res.status(409).json({ user: "Password is incorrect" });
//             }
//         }

//     } catch (error) {
//         return res.status(500).json({ error })
//     }
// }

// export { registry, login, refreshToken, changePassword };
