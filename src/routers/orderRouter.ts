// import { Router } from 'express';
// import { createOrder, deleteOrder, findAllOrders, getAnalyticDashboard, getAnalyticOrderByCustomer, getOrderByCustomerId, getOrderById, topCustomer, updateOrder } from '../controllers';
// import { authorize } from '../middleware/authMiddleware';

// const router = Router();

// router.get('/list', findAllOrders);
// router.post('/create', createOrder);
// router.put('/edit', authorize(['ADMIN']), updateOrder);
// router.delete('/delete/:id', authorize(['ADMIN']), deleteOrder);
// router.get('/list/customer/:customerId', getOrderByCustomerId);
// router.get('/list/analytic/customer/:customerId', getAnalyticOrderByCustomer);
// router.get('/detail/:id', getOrderById);
// router.get('/dashboard', authorize(['ADMIN']), getAnalyticDashboard);
// router.get('/customer', topCustomer);

// export default router;
