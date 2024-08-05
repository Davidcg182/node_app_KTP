import express from 'express';
import authRoute from './routes/authRoute.js'
import ticketsRoute from "./routes/ticketsRoute.js"
import usersRoute from "./routes/usersRoute.js"

const app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(express.json());

app.use('/auth', authRoute);
app.use('/tickets', ticketsRoute);
app.use('/users', usersRoute);


export default app;