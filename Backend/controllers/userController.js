import User from "../models/User.js"
import bcrypt from "bcryptjs"
import generateToken from "../utils/generateToken.js"
import { loginSchema, registerSchema } from "../validators/userValidator.js"

export const registerUser = async(req,res,next) => {
    const {name,email,password} = req.body
    
    try {
        const {error} = registerSchema.validate(req.body)

        if(error){
            res.status(400)
            throw new Error(error.details[0].message)
        }

        const existingUser = await User.findOne({email})
        if(existingUser){
            res.status(400)
            throw new Error("User already exists")
        }
const hashedPassword = await bcrypt.hash(password, 10)

const user = await User.create({
    name,email,password:hashedPassword
})

res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    // token: generateToken(user._id),
    message:"User created",
})
    } catch(error) {
         next(error)
    }
}

export const loginUser = async(req,res,next) => {
    const {email, password} = req.body

    try {
        const {error} = loginSchema.validate(req.body)

        if(error){
            res.status(400)
            throw new Error(error.details[0].message)
        }

        const user = await User.findOne({email})

        if(user && (await bcrypt.compare(password, user.password))) {
            return res.json({
                _id:user._id,
                name:user.name,
                email:user.email,
                token:generateToken(user._id),
                message: "login success"
            })
        }
        else {
            res.status(401)
            throw new Error("Invalid email or password")
        }
    } catch (error) {
        next(error)
    }
}

export const uploadProfileImage =  async(req, res) => {
    try {
        const imagePath =  `/uploads/${req.file.filename}`

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { profileImage : imagePath },
            {new: true}
        )
        
        res.json({
            message: "Uploaded successfully",
            image: imagePath,
            user,
        })
    } catch (err) {
            res.status(500).json({message: err.message})
    }
}