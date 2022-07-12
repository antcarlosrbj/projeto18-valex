import express from "express";
import "express-async-errors";
import cors from "cors";
import dotenv from "dotenv";
import errorHandler from "./middlewares/errorHandlerMiddleware.js";
import router from "./routers/index.js";
dotenv.config();
var app = express();
app.use(cors());
app.use(express.json());
app.use(router);
app.use(errorHandler);
var port = +process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Server is up on port: ".concat(port));
});
export default app;
