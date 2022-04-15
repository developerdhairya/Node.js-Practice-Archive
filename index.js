//Imports
const express = require("express");
const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const docsRoute = require('./routes/docs');



//Initializing express
const app = express();

//Loading contents from .env file
dotenv.config();

//Connecting to mongodb
mongoose.connect(process.env.MONGO_URL, () => { console.log("MongoDB Connection Established") });


//Adding middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

//routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/",docsRoute);

app.listen(8800, () => console.log("Backend Server is Running"));

