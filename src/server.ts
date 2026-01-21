import express from 'express'
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { userRoute } from './routes/userRoutes.js'
import { chatRoute } from './routes/chatRoutes.js'
import { paymentRoute } from './routes/paymentRoutes.js'


const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


dotenv.config()
const port = process.env.PORT || 3000


app.use("/api/v1/Register", userRoute)
app.use("/api/v1/chat", chatRoute)
app.use("/api/v1/payment",paymentRoute)





app.listen(port , ()=>{
    console.log("App listenting on port:", port)
})