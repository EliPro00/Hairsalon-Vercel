const express = require('express');
require('dotenv').config()
const mongoose = require('mongoose')
const cors = require('cors');
const fs = require('fs')
const path = require('path')



const barberModel = require('./routes/barbers')
const ownerModel = require('./routes/owners')
const appointmentModel = require('./routes/appointment');
const Specialities = require('./routes/specialitiesR')

const app = express()

app.use(cors({
  origin: ["https://hairsalon-vercel-test2.vercel.app"],
  methods: ["POST", "GET"],
  credentials: true
}));

app.use(express.json())
app.use(express.static('public'));

app.use(( req , res , next) => {
    console.log(req.path , req.method )
    next()
})

app.use('/barbers' , barberModel)
app.use('/owners'  , ownerModel)
app.use('/appointment' , appointmentModel)
app.use('/spec' , Specialities)


mongoose.connect(process.env.MONGO_URI)
.then(() => {

    app.listen(process.env.PORT , () => {
        console.log("Port running and connected to database" , process.env.PORT) 
    })
    
})
.catch((err) => {
    console.log(err)
})



