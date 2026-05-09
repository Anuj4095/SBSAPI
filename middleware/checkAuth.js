const jwt = require('jsonwebtoken')
module.exports = async(req,res,next)=>{
    try{
        const token = await req.headers.authorization.split(" ")[1]
        await jwt.verify(token,"ak47")
        next()

    }
    catch(err){
        return res.status(500).json({
            error:"invalid  user banta"
        })
    }
}