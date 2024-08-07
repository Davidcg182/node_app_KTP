import express from 'express';
import { signup, login, authentication, restrictTo } from '../controller/authController.js'

const router = express.Router();

router.post('/signup', signup)
router.post('/login', login)
router.get('/authentication', authentication, restrictTo('0'))

export default router