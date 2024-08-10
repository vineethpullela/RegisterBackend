const mangoose=require("mongoose");


const Registeruser=mangoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true

    },
    password:{
        type:String,
        required:true
    },
        confirmpassword:{
            type:String,
        required:true
    }

})


module.exports = mangoose.model("registeruser",Registeruser)