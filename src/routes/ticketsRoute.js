import express from 'express';
import { createTicket, deleteTicket, getTickets, updateTicket } from "../controller/ticketsController.js"
import { authentication, restrictTo } from '../controller/authController.js'

const route = express.Router();

route.get('/', authentication, getTickets);
route.post('/newticket', authentication, restrictTo('0'), createTicket);
route.delete('/delete/:id', authentication, restrictTo('0'), deleteTicket)
route.put('/update/:id', authentication, restrictTo('0'), updateTicket)

export default route
