const express = require('express');
const cors = require('cors');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

app.listen(process.env.PORT);
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:3000',
    optionSuccessStatus: 200,
    credentials: true,
};
app.use(cors(corsOptions));

const userRouter = require('./routes/users');
const bookRouter = require('./routes/books');
const categoryRouter = require('./routes/category');
const likeRouter = require('./routes/likes');
const cartRouter = require('./routes/carts');
const orderRouter = require('./routes/orders');

app.use("/users", userRouter);
app.use("/books", bookRouter);
app.use("/category", categoryRouter);
app.use("/likes", likeRouter);
app.use("/carts", cartRouter);
app.use("/orders", orderRouter);