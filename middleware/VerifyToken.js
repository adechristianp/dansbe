import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    if(authHeader){
        const token = authHeader && authHeader.split(' ')[1]
        if(token === null) return res.sendStatus(401)
        jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
            if(err) {
                return res.status(401).json({
                    status: "error",
                    message: "Unauthorized"
                })
            }else{
                req.user = user;
                next()
            }
        })
    }else{
        return res.status(401).json({
            status: "error",
            message: "Unauthorized"
        })
    }
}