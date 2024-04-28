const express = require('express')

const { Owner } = require('../models/barberModel')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)


router.post('/', async (req, res) => {
    const b_id = req.user._id
    const { firstname, lastname, address, email, emiratesID, phone  } = req.body;
    try {
        const owner = await Owner.create({ firstname, lastname, address, email, emiratesID, phone , b_id });
        res.status(200).json(owner);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});



router.get('/', async (req, res) => {
    try {
        const owners = await Owner.find({});
        res.status(200).json(owners);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id' , async ( req, res) => {
    const { id } = req.params

    try {
        const owner = await Owner.findByIdAndDelete(id)
        res.status(200).json(owner)
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

router.get('/:id' , async(req,res) =>{
    const { id }= req.params
    try {
        const owner = await Owner.findById(id)
        res.status(200).json(owner)
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

router.patch('/:id' , async(req,res) => {
    const { id }= req.params
    try {
        const owner = await Owner.findByIdAndUpdate(id , req.body)
        res.status(200).json(owner)
    } catch (error) {
        res.status(400).json({ message: error.message });

    }
})
module.exports = router