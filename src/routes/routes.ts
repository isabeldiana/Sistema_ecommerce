import { Router } from "express";
import users from '../controllers/Users/users'
const router = Router();

router.post('/createUsers', users.createUsers )
router.get('/showUser/:id', users.showUser )


export default router;