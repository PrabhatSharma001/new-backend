import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app= express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"})) //sets the json size limit for payload
app.use(express.urlencoded({extended:true})) //isse params me ane wale data ko hum encode karte h 
app.use(express.static("public")) //isme hum server par ane wali files pdf images ko is public folder me store rakhnege
app.use(cookieParser()); //isse hum server se user ke browser ki cookies ko set and read kar payenge



//routes import 

import userRouter from "./routes/user.routes.js"



//routes declaration
app.use("/api/v1/users",userRouter)








// now the url will look like 
// http://localhost:8000/api/v1/users/register

export {app};
