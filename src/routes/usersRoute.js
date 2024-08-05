import express from 'express';
import { getUsers, deleteUser, updateUser } from "../controller/usersController.js"
import { authentication, restrictTo } from '../controller/authController.js'

const route = express.Router();

route.get('/', authentication, getUsers);
route.delete('/delete/:id', authentication, restrictTo('0'), deleteUser)
route.put('/update/:id', authentication, restrictTo('0'), updateUser)

export default route