import { Router } from "express";
import users from '../controllers/Users/users'
import products from "../controllers/Products/products";
import userType from "../Middleware/userType";
import orders from "../controllers/Orders/orders";
const router = Router();

//users
router.post('/createUsers', users.createUsers )

//products
router.post('/createProduct/:userType', userType.admMiddleware, products.createProduct )
router.get('/showeProduct/:userType', userType.clientMiddleware, products.showStock )
router.put('/updateProduct/:userType/:id', userType.admMiddleware, products.updateProduct )
router.delete('/deleteProduct/:userType/:id', userType.admMiddleware, products.deleteProduct )

//orders
router.post('/createOrder/:userType/:id', userType.clientMiddleware, orders.createOrder )
router.get('/showeAllOrders/:userType', userType.admMiddleware, orders.showeAllOrders )
router.get('/showeOrders/:userType/:id', userType.clientMiddleware, orders.showeOrdersByClient )
export default router;