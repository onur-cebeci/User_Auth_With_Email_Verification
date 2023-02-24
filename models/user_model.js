const mongoose = require('mongoose');
const validator=require('validator');
const Schema = mongoose.Schema;



const userSchema = new Schema({

    name:{
        type:String,
        required:true,
        trim:true,
      
    },
    surname:{
        type:String,
        required:true,
        trim:true,
        minLength:[3,'Name should be minimum of 3 characters']

    },
    email:{
        type:String,
        required:true,
        unique:true,
       trim:true,
   
       validate(value){
        if(!validator.isEmail(value)){
            throw new Error ("Please enter correct email");
        }
    }
    
    
 },
 emailAktif:{
    type:Boolean,
    default:false
 },
 password:{
    type:String,
    required:true,
    minLength:[6,'Password should be minimum of 6 characters']
}
},{collection:"Users",timestamps:true});


const userModel = mongoose.model('User',userSchema);

module.exports = userModel;