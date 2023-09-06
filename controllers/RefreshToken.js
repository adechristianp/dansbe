import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const RefreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        console.log("refreshToken", refreshToken)
        if(!refreshToken){
            return res.status(401).json({
                status: "error",
                message: "Unauthorized"
            });
        }
        const user = await Users.findOne({
            where: {
                refresh_token: refreshToken
            }
        })
        if(!user){
            return res.status(401).json({
                status: "error",
                message: "Unauthorized"
            });
        }
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, data) => {
            if(err){
                return res.status(401).json({
                    status: "error",
                    message: "Unauthorized"
                });
            }else{
                delete user.dataValues.password;
                delete user.dataValues.refresh_token;
                delete user.dataValues.createdAt;
                delete user.dataValues.updatedAt;
                const token = jwt.sign(user.dataValues, process.env.ACCESS_TOKEN, {
                    expiresIn: '10m'
                });
                return res.status(200).json({
                    status: "success",
                    data: {
                        token,
                    }
                })
            }
        })
    } catch (error) {
        console.log("error", error)
    }
}