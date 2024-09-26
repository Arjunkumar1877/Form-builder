import express from 'express';
import { userController } from '../controllers/userController.js';
const router = express.Router();



router.post("/signup", userController.signupUser);


router.post("/login", userController.loginUser);


router.post('/add_form', userController.saveForm);


router.get('/get_forms/:creatorId', userController.getAllForms);


router.get('/getA_form/:formId/:creatorId', userController.getAllForms);

export default router