import express, { Request, Response, json } from "express";
import cors from "cors";
import dotenv from "dotenv";

import errorHandler from "./middlewares/errorHandlerMiddleware.js";
import router from "./routers/index.js";

dotenv.config();
const app = express();

app.use(cors())
app.use(express.json())
app.use(router);
app.use(errorHandler);


const port = +process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is up on port: ${port}`)
})

export default app;