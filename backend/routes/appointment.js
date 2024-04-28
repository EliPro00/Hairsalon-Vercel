const Appointment = require('../models/appointmentModel')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')


// get all appointments

router.use(requireAuth)


const getAppoint = async(req,res) => {
    const { id } = req.params
    try {
        const appointment = await Appointment.find({bp_id : id}).sort({ createdAt : -1})
        res.status(200).json(appointment)
    } catch (error) {
        res.status(400).json({ message : error.message})
        console.log(error)
        
    }
    
}

//get a single appointment

const getSingleAppoint = async (req,res) => {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ error : "No such appointment"})
    }
    try {
        const appointment = await Appointment.findById(id)
    res.status(200).json(appointment)
    } catch (error) {
        res.status(400).json({ mssg : error.message})
        console.log(error)
    }
    
    
}

const toggleAppointment = async(req,res) => {
    const { id }= req.params
    const alldata = await Appointment.findById(id)
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ error : "No such appointment"})
    }
    try {
        const appointment = await Appointment.findByIdAndUpdate(id , { $set : { status :  !alldata.status} })
        res.status(200).json(appointment)

    } catch (error) {
        console.error('Failed to activate barber:', error);
        res.status(500).json({ message: "Failed to active barber", error: error.message });
    }
}
// whatsapp message

//get barbers appointment

const getBarberApp = async(req,res) => {
    const { id } = req.params
    try {
        const appointment = await Appointment.find({ barber : id})
        res.status(200).json(appointment)
    } catch (error) {
        res.status(400).json({ mssg : error.message})
        console.log(error)
    }
}



// create a new appointment

const createAppoint = async(req,res) => {
    const { name , service , barber , date , time , email , phoneNumber , tip , finalAmount , discount , status} = req.body
    const bp_id = req.user._id 
    try {
        const appointment = await Appointment.create({ name , service , barber  , phoneNumber , email , date , time , tip , finalAmount , discount , bp_id , status})
        res.status(200).json(appointment)
    } catch (error) {
        res.status(400).json({ err : error.message})
    }
}

const getTime = async (req,res)=>{
    const { id } = req.params
    try {
        const barber = await Appointment.findById(id).sort({ createdAt : -1}).select({date : 2 , barber : 3 , time : 4 , _id: 0})
        res.status(200).json(barber)
    } catch (error) {
        res.status(400).json({ message : error.message})
        console.log(error)
        
    }

}
// delete a appointment

const deleteAppoint = async(req,res) =>{
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ error : "No such appointment"})
    }
    try {
        const appointment = await Appointment.findByIdAndDelete(id)
        res.status(200).json(appointment)
    } catch (error) {
        res.status(400).json({ mssg : error.message})
        console.log(error)
    }
    
}

// updated a appointment
const updateAppoint = async(req,res) => {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ error : "No such appointment"})
    }
    try {
        const appointment = await Appointment.findByIdAndUpdate(id , req.body)
        res.status(200).json(appointment)
    } catch (error) {
        res.status(400).json({ mssg : error.message})
        console.log(error)
    }
}

router.get('/bpapp/:id' , getAppoint)
router.get("/time/:id" , getTime)
router.get('/:id' , getSingleAppoint)

router.post('/' , createAppoint)
router.patch('/toggleapp/:id' , toggleAppointment)


router.delete('/:id' ,deleteAppoint)

router.patch('/:id' ,updateAppoint)
router.get('/barberapp/:id' , getBarberApp)

module.exports = router