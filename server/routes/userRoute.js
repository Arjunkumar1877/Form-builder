import express from 'express';
import { userController } from '../controllers/userController.js';
const router = express.Router();



router.post("/signup", userController.signupUser);


router.post("/login", userController.loginUser)

export default router