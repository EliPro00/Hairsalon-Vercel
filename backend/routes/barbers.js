const express = require('express');
const { Barbershop , Barber } = require('../models/barberModel')
const { loginUser , signupUser} = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')
const Specialties = require('../models/specialities')
const multer = require('multer')
const path = require('path')


const router = express.Router()

// login
router.post('/login' , loginUser)
router.post('/signup' ,  signupUser)


router.use(requireAuth)

// insert 

// get barbershop details

// post pictures
// storage

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/Images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

// Configure multer to handle both emiratesID and image file fields


router.post('/:id/barbers', upload.single('image'), async(req, res) => {
    const { id } = req.params;
    const b_id = req.user._id
    const {   
         f_name,
        l_name,
        specialties,
        experienceYears,
        phoneNumber,
        
        } = req.body;
    
    try {
  

        const newBarber = await Barber.create({
            f_name,
            l_name,
            specialties,
            experienceYears,
            phoneNumber,
            b_id,
            image: req.file.filename,

        });
        

        await Barbershop.findByIdAndUpdate(
            id,
            { $push: { barbers: newBarber._id } }, // Use $push to add to the array of barbers
            { new: true, useFindAndModify: false } // Options for the update
          );
      
          res.status(201).json({ message: "Barber added successfully", barber: newBarber  , barberId: newBarber._id});
        } catch (error) {
          console.error('Failed to add barber:', error);
          res.status(500).json({ message: "Failed to add barber", error: error.message });
        }
      });







router.get('/bp/:id' , async (req,res) => {
    try {
        const { id } = req.params
        const barbershop = await Barbershop.findById(id)
        res.status(200).json(barbershop)
    } catch (error) {       
        res.status(400).json({ error : error.mesage})
    }    
})

// get all barbershops

router.get('/bp' , async(req,res) => {
    try {
        const barbershop = await Barbershop.find({})
        res.status(200).json(barbershop)
    } catch (error) {
        res.status(400).json({ error : error.message})
    }
})

// find which barbershop is the barber in

router.get('/findbarber/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const barbershop = await Barbershop.findOne({ barbers: id });
        
        if (barbershop) {
            res.status(200).json(barbershop);
        } else {
            res.status(404).json({ message: 'Barbershop not found for the given barber ID' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// get barber's details 

router.get('/:id' , async(req,res) => {
    try {
        const { id } = req.params
        const barber = await Barber.findById(id)
        res.status(200).json(barber)
    } catch (error) {
        res.status(400).json({ error : error.message})
    }

})

// get all barber
router.get('/bpb/:b_id', async (req, res) => {
    const { b_id } = req.params;
    try {
        // Use `find` method to get an array of barbers that match the barbershop ID
        const barbers = await Barber.find({ b_id: b_id });
        if (barbers.length > 0) {
            res.status(200).json(barbers);
        } else {
            res.status(404).json({ message: "No barbers found for the given barbershop ID." });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});


// POST A BARBER INSIDE BARBER SHOP

router.post('/barbershop' , async (req,res) => {
    const { name , location} = req.body



    
    try {
        const barbershop = Barbershop.create({name , location})
        res.status(200).json(barbershop)
    } catch (error) {   
        console.log(err)
    }
})




  router.patch('/active/:id' , async (req,res) => {
    try {
        const { id } = req.params
        const barber = await Barber.findById(id)
        if(!barber){
            return res.status(405).json({ message : "Barber Not Found"})
        }
        const response = await Barber.findByIdAndUpdate(id , { $set : { isactive :  !barber.isactive} })
        res.status(200).json({ message : response})
    } catch (error) {
        console.error('Failed to activate barber:', error);
        res.status(500).json({ message: "Failed to active barber", error: error.message });
    }
  })


  router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBarber = await Barber.findByIdAndDelete(id);
        if (deletedBarber) {
            // Perform the cascade delete action
            await Barbershop.updateMany(
                { },
                { $pull: { barbers: id } }
            );
            res.status(200).json(deletedBarber);
        } else {
            res.status(404).json({ message: 'Barber not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


//update the user to be in active


// middleware to delete barber from barbershop
 

router.patch('/:id' , async (req,res) => {
    try {
        const { id } = req.params
        const barber = await Barber.findByIdAndUpdate({ isactive : true})
        if(barber){
            res.status(200).json(barber)
        }else {
            res.status(400).json({ mssg : "Barber not found"})
        }
    } catch (error) {
        res.status(404).json({ error : error.message})
    }

})


router.put('/bp/:id' , async(req,res) => {
    try {
        const { id } = req.params
        const updateData = req.body;
        
        // Update the document
        const barbershop = await Barbershop.findByIdAndUpdate(id, updateData, { new: true });
        if(barbershop){
            res.status(200).json(barbershop)

        }
    } catch (error) {
        res.status(404).json({ error : error.mesage})
    }
})


module.exports = router