import { Router } from "express";
import users from '../controllers/Users/users'
import products from "../controllers/Products/products";
import orders from "../controllers/Orders/orders";
import auth from "../Middleware/authMiddleware";
const router = Router();

//users
router.post('/createUsers', users.createUsers );
router.post('/login', users.login );

router.use(auth.authMiddleware) 

//products
router.post('/createProduct' , auth.verifyAdmin, products.createProduct );
router.get('/showeProduct', auth.authMiddleware, auth.verifyAdmin , products.showStock );
router.put('/updateProduct/:id', auth.authMiddleware, auth.verifyAdmin, products.updateProduct );
router.delete('/deleteProduct/:id',auth.authMiddleware, auth.verifyAdmin, products.deleteProduct );

//orders
router.post('/createOrder', auth.verifyClient, auth.authMiddleware, orders.createOrder );
router.get('/showeAllOrders', auth.verifyAdmin, orders.showeAllOrders );
router.get('/showeOrders', auth.authMiddleware, auth.verifyClient, orders.showeOrdersByClient );




export default router