import mongoose from 'mongoose'
import Student from './Student'

const   userSchema = new mongoose.Schema(
    {
        name :{
            type :String,
            trim:true,
            required : true

        },
        email: {
            type:String,
            trim:true,
            required:true,
            unique:true,
            lowercase:true
        },
        password:{
            type:String,
            required:true,
            minlength:6
        },
        role:{
            type:String,
            emun:["student","admin"],
            default:student
        },
    },
    {
        timestamps:true,
    }
);

const User = mongoose.model("User",userSchema);
export default User;