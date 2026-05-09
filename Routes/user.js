const express = require('express')
const Router=express.Router()
const user=require('../model/User')
const User = require('../model/User')
const bycrpt = require('bcrypt')
const jwt = require('jsonwebtoken')

Router.post('/signup',async(req,res)=>{
    try{
        const users = await User.find({email:req.body.email})
        if(users.length>0){
        return res.status(500).json({
                error:"email already rejisterd...."
            })
        }

        const hash = await bycrpt.hash(req.body.password,10)
        const newUser = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone,
            address:req.body.address,
            password:hash
        })
        const data =await newUser.save()
        res.status(200).json({
            newUser:data
        })
    }
    catch(err){ 
        console.log(err)
        res.status(500).json({
            error: err
        });
    }

})


Router.post('/login',async(req,res)=>{
    try{
        const user = await User.find({email:req.body.email})
        console.log(user)
        if(user.length == 0){
            return res.status(500).json({
                error:"email not registerd"
            })
        }

        const isPasswordCorrect = await bycrpt.compare(req.body.password,user[0].password)

        if(!isPasswordCorrect){
            return res.status(500).json({
                error:"invalid password"
            })
        }
        //jwt.sign({detail jo dalna hai},"secret key")
        const token = await jwt.sign({
            _id:user[0]._id,
            fullName:user[0].fullName,
            email:user[0].email,
            address:user[0].address,
            phone:user[0].phone,

        },process.env.key,{expiresIn:'7d'})

        res.status(200).json({
            _id:user[0]._id,
            fullName:user[0].fullName,
            email:user[0].email,
            address:user[0].address,
            phone:user[0].phone,
            token:token
        })
    }
        
    
    catch(err){
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})

Router.get('/allusers', async(req,res)=>{
    try{
        const data = await User.find().select();
        res.status(200).json({
            userlist:data
        })
    }
    catch(err)
    {
        res.status(500).json({
            error:err
        })
    }
})
Router.get('/count',async(req,res)=>{
    try{
        const total =await User.countDocuments()
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






module.exports = Router






























