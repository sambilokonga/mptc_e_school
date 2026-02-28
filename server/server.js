import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDB from './configs/mongodb.js'
import { clerkWebHooks } from "./controllers/webhooks.js"

const app = express()

// Connect to database
await connectDB()

// Middleware
app.use(cors())


// Routes
app.get("/", (req, res)=> res.send("API Working"))
app.post("/clerk", clerkWebHooks)

export default app