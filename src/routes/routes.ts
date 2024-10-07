import { Router } from "express";
import users from '../controllers/Users/users'
const router = Router();

router.post('/createUsers', users.createUsers )



export default router;