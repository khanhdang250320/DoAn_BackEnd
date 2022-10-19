// import mongoose, { Document, Schema } from 'mongoose';
// import { OrderType } from '../interfaces';

// export interface OrderModel extends OrderType, Document {}

// const OrderSchema = new Schema(
//     {
//         customerId: { type: String, required: true },
//         phone: { type: String, required: true },
//         billAddress: { type: String, required: true },
//         shippingAddress: { type: String, required: true },
//         deliverySchedule: {
//             title: { type: String, required: true },
//             description: { type: String, required: true }
//         },
//         products: [
//             {
//                 productId: { type: String, required: true },
//                 price: { type: Number, required: true },
//                 quantity: { type: Number, required: true },
//                 unit: { type: String, required: true }
//             }
//         ],
//         tax: {
//             taxId: { type: String, required: true },
//             rate: { type: Number, required: true }
//         },
//         shipping: {
//             shippingId: { type: String, required: true },
//             fee: { type: Number, required: true }
//         },
//         coupon: {
//             couponId: { type: String, required: false },
//             type: { type: String, required: false },
//             amount: { type: Number, required: false }
//         },
//         orderStatus: { type: Number, required: true },
//         paymentMethodId: { type: String, required: true },
//         internetBankingImage: { type: String, required: false },
//         total: { type: Number, required: true }
//     },
//     {
//         timestamps: true,
//         collection: 'orders'
//     }
// );

// OrderSchema.set('toJSON', {
//     virtuals: true,
//     versionKey: false,
//     transform: function (doc, ret) {
//         delete ret._id;
//     }
// });

// export default mongoose.model<OrderModel>('order', OrderSchema);
