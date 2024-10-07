import { Router } from "express";
import users from '../controllers/Users/users'
import products from "../controllers/Products/products";
import userType from "../Middleware/userType";

const router = Router();

router.post('/createUsers', users.createUsers )

//products
router.post('/createProduct/:tipo_usuario', userType.admMiddleware, products.createProduct )
router.put('/createProduct/:tipo_usuario/:id', userType.admMiddleware, products.updateProduct )
router.delete('/createProduct/:tipo_usuario/:id', userType.admMiddleware, products.deleteProduct )


export default router;