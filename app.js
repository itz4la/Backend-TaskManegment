const express = require('express');
const connectDB  = require('./config/DB')
const dotenv = require('dotenv').config()
const port = process.env.APP_PORT
const app = express()

//Middleware
app.use(express.json())

// DB Connection 
connectDB()

// Routes config
app.use('/users', require('./routes/userManegmentRoutes'))


app.listen(port, ()=>{
    console.log('app started and listening to port :' + port)
})