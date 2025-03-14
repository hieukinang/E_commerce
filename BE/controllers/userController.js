import userModel from "../models/userModel.js"
import validator from "validator"
import brcypt from "bcrypt"
import jwt from "jsonwebtoken"
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}
//route user login
const loginUser = async (req, res) => {

}

//route user register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        //checking user alredy exists or not
        const exists = await userModel.findOne({ email })
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }
        //validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }
        //hashing user password
        const salt = await brcypt.genSalt(10)
        const hashedPassword = await brcypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({ success: true, token })
    } catch (error) {
        console.log(error)
        res.json({ success: false, massage: error.massage })
    }
}

//route admin login
const adminLogin = async (req, res) => {

}


export { loginUser, registerUser, adminLogin }