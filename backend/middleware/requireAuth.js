const jwt = require('jsonwebtoken')
const { Barbershop, Barber} = require('../models/barberModel')
const requireAuth = async(req , res , next) => {

    const { authorization } = req.headers

    if(!authorization){
        return res.status(401).json({ error : "Authorization Token required"})
    }

    const token = authorization.split(' ')[1]
    try {
        const {_id} = jwt.verify(token , process.env.SECRET)
        req.user = await Barbershop.findOne({ _id}).select('_id')
        next()
    } catch (error) {
        console.log(error)
        res.status(400).json({ err : 'Request not authorized'})
    }
}

module.exports = requireAuth