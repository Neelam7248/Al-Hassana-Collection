//start time 9:13am -9 22am
const mongoose=require('mongoose');
const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,

},
email:{
    type:String,
    required:true,
    unique:true

},

password:{
    type:String,
    required:true,
   },
phone:{
    type:String,
    required:true,

},
address:{
    type:String,
    required:false,

},
userType: { 
  type: String, 
  enum: ['admin', 'customer'],
  default: 'customer' 
},

isActive: {
  type: Boolean,
  default: true  // true = Active, false = Deleted
}
,// new
    verificationToken: String, // new,

createdAt: {
  type: Date,
  default: Date.now
}


})
module.exports=mongoose.model('User',UserSchema);