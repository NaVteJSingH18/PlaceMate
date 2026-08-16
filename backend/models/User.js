import mongoose from 'mongoose'

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
            enum:["student","admin"],
            default:"student"
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    {
        timestamps:true,
    }
);

const User = mongoose.model("User",userSchema);
export default User;