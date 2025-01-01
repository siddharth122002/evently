import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    clerkId:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    username:{
        type:String,
        required:true,
        unique:true,
    },
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    photo:{
        type:String,
        required:true,
    }
});

export const User = mongoose.models.User || mongoose.model('User',userSchema);

