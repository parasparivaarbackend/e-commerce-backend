import express from "express";
import cors from "cors"
import statusMonitor from 'express-status-monitor';

const app = express()


// use middleware

app.use(express.json({limit:"10mb"}))
app.use(express.urlencoded({limit:"10mb",extended:true}))
app.use(express.static("public"))
app.use(cors())
app.use(statusMonitor());
// // app.use(cors({
// //     origin: 'http://localhost:3000',
// //     methods: ['GET', 'POST'], // Specify allowed methods
// //     allowedHeaders: ['Content-Type', 'Authorization'] // Specify allowed headers
// // }));
// const corsOptions = {
//     origin: ['http://localhost:3000', 'https://example.com'], // Array of allowed origins
//     methods: 'GET,POST', // Allowed methods
//     allowedHeaders: 'Content-Type,Authorization', // Allowed headers
//     credentials: true, // Allow credentials (cookies, authorization headers, etc.)
//     optionsSuccessStatus: 200 // Response status for successful OPTIONS request
// };

// app.use(cors(corsOptions));

    

// local imports 
import routes from "./routes/index.routes.js"
import { errorMiddleware } from "./middleware/errorMiddleware.js";

app.use("/api/v1",routes)
app.use(errorMiddleware);


export {app}