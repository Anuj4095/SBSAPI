const express = require('express')
const Router=express.Router()
const Contact = require('../Modals/Contact')
//contact details
Router.get('/contacts',(req,res)=>{
    res.status(200).json({
        msg:"contact details"
    })
})
// //add contact
// Router.post('/add_contact',(req,res)=>{
//     res.status(200).json({
//         msg:"contact add"
//     })
// })


// Router.post('/add-contact',async(req,res)=>{
//     try {
//         const newContact = new Contact({
//             fullName: req.body.name,
//             email: req.body.person_email,
//             phone: req.body.person_phone,
//             address: req.body.add
//         })
//         const newData = await newContact.save()
//         res.status(200).json({
//             result:newData
//         })

//     }
//     catch(err)
//     {
//         console.log(err)
//         res.status(500).json({
//             error:err
//         })
//     }
// })

// // get all contact
// Router.get('/all-contact',async(req,res)=>{
//     try
//     {
//         const allContact = await Contact.find()
//         res.status(200).json({
//             contacts:allContact
//         })
//     }
//     catch(err)
//     {
//         console.log(err)
//         res.status(500).json({
//             error:err
//         })
//     }
// })


module.exports = Router