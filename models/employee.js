const mongoose = require('mongoose');

const schema= mongoose.Schema({
    name:String,
    cnic:Number,
    email:String,
    contact:String,
    gender:String,
    salary:Number,
    address:String,
    dob:Date,
    post:String,
    password:String,
    jobdes:String,
    role:{
        type:String,default:"employee"
    }
})

const employee= mongoose.model("ems",schema);
module.exports=employee;