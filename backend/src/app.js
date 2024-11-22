import express from "express";
import { createServer } from "node:http";

import { connectToSocket } from "./controllers/socketManager.js";
import mongoose from "mongoose";

import cors from "cors";
import userRoutes from "./routes/user.routes.js"

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", (process.env.PORT || 8000 ))

// app.get("/home", (req,res) => {
//     return res.json( {"hello":"word"} )
// });

app.use(cors());
app.use(express.json({limit:"40kb"}))
app.use(express.urlencoded({ limit : "40kb", extended : true }));

app.use("/api/v1/users", userRoutes);
// app.use("/api/v2/users", newUserRoutes);


const start = async() => {
    const connectionDb = await mongoose.connect("mongodb+srv://nimesh:nimesh22@cluster0.29f6u.mongodb.net/")

    console.log(`MONGODB connected to DB : ${connectionDb.connection.host}`)
    server.listen(app.get("port"), () => {
        console.log(`LISTENING on PORT ${app.get("port")}`);
    });
}

start();

