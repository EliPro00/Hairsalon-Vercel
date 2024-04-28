const Specialities = require('../models/specialities')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')


router.use(requireAuth)

const postSpec = async(req,res) => {
    const { b_id , speciality , price , time} = req.body
    try {
        const spec = await Specialities.create({  b_id , speciality , price , time })
        res.status(200).json(spec)
    } catch (error) {   
        console.log(error)
        res.status(404)
        .json({ error : error.message})
    }
}

const getSpec = async (req,res) => {
    const  { id } = req.params
    try {
        const spec = await Specialities.find({ b_id : id}) 
        res.status(200).json(spec)
    } catch (error) {
        res.status(405)
        .json({ error : error.message})
    }
}

router.post('/' , postSpec)
router.get('/:id' , getSpec)

module.exports = router