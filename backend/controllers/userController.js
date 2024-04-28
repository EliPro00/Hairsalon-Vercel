const { Barbershop} = require('../models/barberModel')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')

const createToken = (_id , name , location) => {
   return jwt.sign({ _id , name , location   }, process.env.SECRET , { expiresIn : '3d'})
}

const signupUser = async (req,res)=> {
    const { email , password , name , location} = req.body

    try {
        const user = await Barbershop.signup ( email , password , name , location)
        const token = createToken(user._id) 
        res.status(200).json({ email , token , id : user._id})
    } catch (error) {
        res.status(400).json({ error : error.message})        
    }
}

const loginUser = async (req,res)=> {
    const { email , password , name , location} = req.body

    try {
        const user = await Barbershop.login ( email , password )
        const token = createToken(user._id)
        res.status(200).json({ email , token , id : user._id})

    } catch (error) {
        res.status(400).json({ error : error.message})        
    }

}

module.exports = { loginUser , signupUser}