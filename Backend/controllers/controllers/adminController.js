import User from "../models/User.js"

//get all users
export const getAllUsers = async(req,res) => {
    try {
        const users = await User.find().select("-password")
        res.json(users)
    }
    catch(error) {
        res.status(500).json(error.messsage)
    }
}

//delete user
export const deleteUser = async(req,res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user) return res.status(404).json("User not found")
            await user.deleteOne()
        res.json("User deleted") 
    }
    catch(error) {
        res.status(500).json(error.messsage)
    }
}

//change user role 
export const changeUserRole = async(req,res)=>{
  try{
    const {role} = req.body
    const user = await User.findById(req.params.id)
    if(!user) return res.status(404).json("User not found")
    user.role = role
    await user.save()
    res.json(user)
  }catch(error){
    res.status(500).json(error.message)
  }
}