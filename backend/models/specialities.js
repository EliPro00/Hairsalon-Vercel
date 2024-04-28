const mongoose = require('mongoose')
const Schema = mongoose.Schema

const specialitieSchema = new Schema ({
    b_id : {
        type : String ,
        required : true
    },
    speciality : {
        type : String,
        required : true
    },
    price : {
        type : Number , 
        required : true

    },
    time : {
        type : Number,
    }
},{timestamps : true})

module.exports = mongoose.model('speciality' , specialitieSchema)
