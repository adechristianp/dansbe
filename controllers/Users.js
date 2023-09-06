import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll();
        res.status(200).json({
            status: "success",
            data: users
        })
    } catch (error) {
        console.log("error", error)
    }
}

export const Register = async (req, res) => {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const checkEmail = await Users.findOne({
        where: { email: req.body.email },
    });
    if(checkEmail){
        return res.status(500).json({
            status: "error",
            message: "Email already registered"
        })
    }
    try {
        const newUser = await Users.create({
            name,
            email,
            password: hashPassword
        });
        res.status(200).json({
            status: "success",
            data: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
            },
        })
    } catch (error) {
        console.log("error", error)
        res.status(500).json({
            status: "error",
            message: error,
        })
    }
}

export const Login = async (req, res) => {
    const user = await Users.findOne({
        where: {
            email: req.body.email
        }
    })
    if(!user){
        return res.status(500).json({
            status: "error",
            message: "Email or password is wrong"
        })
    }
    const match = await bcrypt.compare(req.body.password, user.dataValues.password);
    if(!match){
        return res.status(500).json({
            status: "error",
            message: "Email or password is wrong"
        })
    }
    delete user.dataValues.password;
    delete user.dataValues.refresh_token;
    delete user.dataValues.createdAt;
    delete user.dataValues.updatedAt;
    const token = jwt.sign(user.dataValues, process.env.ACCESS_TOKEN, {
        expiresIn: '10m'
    });
    const refreshToken = jwt.sign(user.dataValues, process.env.REFRESH_TOKEN, {
        expiresIn: '1d'
    });
    await Users.update({refresh_token: refreshToken}, {
        where: {
            email: req.body.email
        }
    })
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: false
    })

    res.status(200).json({
        status: 'success',
        data: {
            user:{
                ...user.dataValues,
            },
            token
        }
    })
}
export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(204);
        }
        const user = await Users.findOne({
            where: {
                refresh_token: refreshToken
            }
        })
        if(!user){
            return res.status(204)
        }
        await Users.update({refres_token: null}, {
            where: {
                id: user.dataValues.id
            }
        })
        res.clearCookie('refreshToken');
        return res.status(200).json({
            status: 'success',
        })

}