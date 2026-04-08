const express = require('express')
const Router=express.Router()
//contact details
Router.get('/contacts',(req,res)=>{
    res.status(200).json({
        msg:"contact details"
    })
})
//add contact
Router.post('/add_contact',(req,res)=>{
    res.status(200).json({
        msg:"contact add"
    })
})

module.exports = Router