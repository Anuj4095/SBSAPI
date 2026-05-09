require('dotenv').config()
const express = require('express')
const app = express()
 const bodyParser = require('body-parser')
const dns =require('dns')
const mongoose =require('mongoose')
const fileuplode = require('express-fileupload')
const userRouts = require('./Routes/user')
const contactRouts = require('./Routes/contact')

dns.setServers(["1.1.1.1", "8.8.8.8"]);
const connectWithDatabase = async()=>{
    try{
        // await mongoose.connect(process.env.MONGODB_URL)
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('connected with database')
    }
    catch(err){
        console.log('something is wrong')
        console.log(err)
    }

}
connectWithDatabase()
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(fileuplode({
    useTempFiles:true,
    tempFileDir:'/tmp/'
}))
app.use('/user',userRouts)
app.use('/contact',contactRouts)


module.exports = app


































































// require('dotenv').config()
// const express = require('express')
// const app = express()
// const dns =require('dns')
// const mongoose =require('mongoose')
// const userRouts = require('./Routes/user')
// const contactRouts = require('./Routes/contact')

// dns.setServers(["1.1.1.1", "8.8.8.8"]);
// const connectWithDatabase = async()=>{
//     try{
//         // await mongoose.connect(process.env.MONGODB_URL)
//         await mongoose.connect('mongodb+srv://ANUJ5599:aa2602@db.xwyqugi.mongodb.net/?appName=DB')
//         console.log('connected with database')
//     }
//     catch(err){
//         console.log('something is wrong')
//         console.log(err)
//     }

// }
// connectWithDatabase()

// app.use('/user',userRouts)
// app.use('/contact',contactRouts)

// module.exports = app