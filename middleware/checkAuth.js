const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({
                error: "Authorization header missing"
            })
        }
        const token = req.headers.authorization.split(" ")[1]
        const secretKey = process.env.key || "ak47"
        const decoded = jwt.verify(token, secretKey)
        req.user = decoded
        next()
    }
    catch (err) {
        return res.status(401).json({
            error: "invalid  user banta"
        })
    }
}