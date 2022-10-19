import { Request, Response, NextFunction } from 'express';
import employeeRouter from './employeeRouter';
// import authRouter from './authRouter';
// import orderRouter from './orderRouter';
import customerRouter from './customerRouter';
import foodRouter from './foodRouter';
import drinkRouter from './drinkRouter';
import areaRouter from './areaRouter';
import tableRouter from './tableRouter';
import bookDetailRouter from './bookDetailRouter';
import bookRouter from './bookRouter';
import productRouter from './productRouter';
import productTypeRouter from './productTypeRouter';

const version = {
    v1: '/api/v1'
};
const useRoutes = (app: any) => {
    app.use((req: Request, res: Response, next: NextFunction) => {
        res.header('Access-Control-Allow-Origin', '*');
        next();
    });
    app.use(`${version.v1}/customers`, customerRouter);
    app.use(`${version.v1}/employees`, employeeRouter);
    app.use(`${version.v1}/foods`, foodRouter);
    app.use(`${version.v1}/drinks`, drinkRouter);
    app.use(`${version.v1}/areas`, areaRouter);
    app.use(`${version.v1}/tables`, tableRouter);
    app.use(`${version.v1}/book-details`, bookDetailRouter);
    app.use(`${version.v1}/books`, bookRouter);
    app.use(`${version.v1}/products`, productRouter);
    app.use(`${version.v1}/product-types`, productTypeRouter);
    // app.use(`${version.v1}/auth`, authRouter);
    // app.use(`${version.v1}/orders`, orderRouter);
};

export = useRoutes;
