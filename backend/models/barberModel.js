const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const {Schema} = mongoose;

const BarberSchema = new Schema ({
    f_name : {
        type : String,
        required : true
    },
    l_name : {
        type : String,
        required : true
    },
    specialties : {
        type : [String],
    },
    experienceYears : {
        type : Number,
        required : true
    },
    isactive : {
        type : Boolean,
        default : true
    },
    phoneNumber : {
        type : String
    },
    b_id : {
        type : String
    },
    image : {
        type : String
    }

},{timestamps : true})

const Barber = mongoose.model('Barber', BarberSchema);

const barbershopSchema = new Schema({
    name: String,
    location: String,
    barbershop_img : {
        type : String,
        
    },
    est_year : {
        type : Number
    },
    operating_hrs : {
        type : String
    },
    services : {
        type : String
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    },
    barbers: [{
      type: Schema.Types.ObjectId,
      ref: 'Barber'
    }],
  });

  barbershopSchema.statics.signup = async function ( email , password , name , location)  {
    // validation 
    console.log(email , password)

    if (!email || !password){
        
        throw Error('All fields need to be filled')
    }
    if(!validator.isEmail(email)){
        throw Error('Email not valid')
    }
    if(!validator.isStrongPassword(password)){
        throw Error("Password not strong Enough")
    }
    const exists = await this.findOne({ email })
    if(exists){
        throw Error ('Email already in use')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password , salt)

    const user = await this.create({ email , password : hash , name , location})
    return user

  }

  barbershopSchema.statics.login = async function (email , password){
    if (!email || !password){
        throw Error('All fields need to be filled')
    }
    const user = await this.findOne({ email })
    if(!user){
        throw Error ('Incorrect Email')
    }
    const match = await bcrypt.compare(password , user.password)
    if(!match){
        throw Error ('Incorrect Passowrd')
    }
    return user

  }
  
  const Barbershop = mongoose.model('Barbershop', barbershopSchema);

  const OwnerSchema = new Schema ({
    firstname : {
        type : String,
        required : true
    },
    lastname : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    emiratesID : {
        type : String,
        required : true
    },
    b_id : {
        type : String,
    }
  },{timestamps : true})
  const Owner = mongoose.model('Owner' , OwnerSchema)

  //static signup method



  module.exports = {Barbershop , Barber , Owner}
