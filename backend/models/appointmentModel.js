const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AppointmentSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    service : [{
        type : String,
        required : true
    }],
    barber : {
        type : String,
        required : true
    },
    date : {
        type : String,
        require : false
    },
    phoneNumber : {
        type : String,
    },
    email : {
        type : String,
    },
    time : {
        type : String
    },
    confirm : {
        type : Boolean
    },
    tip : {
        type : Number
    },
    finalAmount : {
        type : String
    },
    discount : {
        type : Number
    },
    bp_id : {
        type : String
    },
    status : {
        type : Boolean,
        default : false
    }

} , {timestamps : true}
)
module.exports = mongoose.model('Appointment' , AppointmentSchema)