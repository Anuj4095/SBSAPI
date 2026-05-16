const express = require('express');
const Router = express.Router();
const Contact = require('../model/Contact');
const checkAuth = require('../middleware/checkAuth');
const User = require('../model/User');
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2
const fileUpload = require("express-fileupload");


cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})

// ADD CONTACT
Router.post('/addcontact',checkAuth, async(req,res) =>{
    try{
        // console.log(req.files.Image);

        // if (!req.files || !req.files.Image) {
        //     return res.status(400).json({
        //         message: "Image not found"
        //     });
        // }
        const token = await req.headers.authorization.split(" ")[1]
        const user=  await jwt.verify(token,process.env.key)
        const file = req.files.image

        const uploadedImage = await cloudinary.uploader.upload(file.tempFilePath)
        // console.log(uploadedImage)
        // console.log(user)
        // console.log(user._id)
        const newContact = new Contact({
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        address:req.body.address,
        gender: req.body.gender,
        userId:user._id,
        imageUrl:uploadedImage.secure_url,
        imageId:uploadedImage.public_id
        });

        const result = await newContact.save()
        res.status(200).json({
            newcontact:result
        })
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            error: err
        });
    }
})

//get contact
Router.get('/allcontact',checkAuth, async(req,res)=>{
    try{
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        const skip = (page-1)*limit
        const token = await req.headers.authorization.split(" ")[1]
        const user=  await jwt.verify(token,process.env.key)
        const data = await Contact.find({userId:user._id}).populate("userId","fullName email phone").select('_id fullName email')
        .select('_id fullName email phone address gender userId imageUrl imageId')
        .skip(skip).limit(limit)
        res.status(200).json({
            contactlist:data
        })
    }
    catch(err)
    {
        res.status(500).json({
            error:err
        })
    }
})

// get contact by id
Router.get('/contactbyid/:id',checkAuth, async(req,res)=>{
    try{
        const data = await Contact.findById(req.params.id)
        const token = await req.headers.authorization.split(" ")[1]
        const user=  await jwt.verify(token,process.env.key)
        if(data.userId != user._id){
            return res.status(500).json({
                error:"invalid user hai"
            })
        }
        res.status(200).json({
            contactbyid:data
        })
    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({
            error:err
        })

    }
})

//get contact by gender
Router.get('/contactbygender/:gender',checkAuth,async(req,res)=>{
    try{
        const token = await req.headers.authorization.split(" ")[1]
        const user=  await jwt.verify(token,process.env.key)
        const data =await Contact.find({gender:req.params.gender,userId:user._id})
        res.status(200).json({
            contactbygender:data
        })

    }
    catch(err){
        console.log(err)
        res.status(500).json({
            erroe:err
        })
    }
})



//delete contact
Router.delete('/:id',async(req,res)=>{
    try{
        const data = await Contact.findById(req.params.id)
        const token = await req.headers.authorization.split(" ")[1]
        const user=  await jwt.verify(token,process.env.key)
        if(data.userId != user._id){
            return res.status(500).json({
                error:"invalid user hai"
            })
        }
        await cloudinary.uploader.destroy(data.imageId)
        await Contact.deleteOne({_id:req.params.id})
        res.status(200).json({
            message:"data deleted"
        })
    }
    catch(err){
        res.status(500).json({
            error:err
        })
    }

})

//delete bu gemnder
Router.delete('/deletebygender/:gender',checkAuth,async(req,res)=>{
    try{
        const token = await req.headers.authorization.split(" ")[1]
        const user=  await jwt.verify(token,process.env.key)
        
        await Contact.deleteMany({gender:req.params.gender,userId:user._id})
        res.status(200).json({
            message:"data deleted"
        })
    }
    catch(err){
        res.status(500).json({
            error:err
        })
    }
})



Router.put('/:id',checkAuth,async(req,res)=>{
    try{

        const data = await Contact.findById(req.params.id)
        const token = await req.headers.authorization.split(" ")[1]
        const user=  await jwt.verify(token,process.env.key)
        if(data.userId != user._id){
            return res.status(500).json({
                error:"invalid user hai"
            })
        }

        const updatedData = {
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone,
            address:req.body.address,
            gender: req.body.gender,
            userId:data.userId

        }

        if(req.files){
            //delete old image
            //uplode new image
            //set lkarenga imageurl and imageid
            await cloudinary.uploader.destroy(data.imageId)
            const file = req.files.image//new image aya
            const uploadedImage = await cloudinary.uploader.upload(file.tempFilePath)//naya image uplode hua
            updatedData.imageUrl = uploadedImage.secure_url//new wala ka image ka url set hua 
            updatedData.imageId = uploadedImage.public_id//new wala image ka id set hua
        }
        else{
            updatedData.imageUrl = data.imageUrl
            updatedData.imageId = data.imageId
        }
        const result = await Contact.findByIdAndUpdate(req.params.id,updatedData,{new:true})
        res.status(200).json({
            updatedData:result
        })
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            error:err
        })

    }
})


//count number of contact api 
Router.get('/count',checkAuth,async(req,res)=>{
    try{
        const token = await req.headers.authorization.split(" ")[1]
        const user=  await jwt.verify(token,process.env.key)
        const total =await Contact.countDocuments({userId:user._id})
        res.status(200).json({
            Total:total
        })
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})
module.exports = Router;

