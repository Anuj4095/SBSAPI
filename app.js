const express = require('express')
const app = express()
const userRouts = require('./Routes/user')
const contactRouts = require('./Routes/contact')
const mongoose=require('mongoose')

const connectWithDatabase = async()=>{
    try{
        await mongoose.connect('mongodb+srv://ANUJ5599:.ZBVr5fnTGwncc.@db.xwyqugi.mongodb.net/?appName=DB')
        console.log('connected with database')
    }
    catch(err){
        console.log('something is wrong')
        console.log(err)
    }

}
connectWithDatabase()

app.use('/user',userRouts)
app.use('/contact',contactRouts)

module.exports = app