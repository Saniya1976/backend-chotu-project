const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    Username:{
        type:String,
        required:true,
        trim:true, 
        minlength:[3, 'Username must be at least 3 characters long'],
        maxlength:50

    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minlength:[10, 'Email must be at least 10 characters long'],
        maxlength:100,
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
  type: String,
  required: true,
  minlength: [6, 'Password must be at least 6 characters long'],
  maxlength: 100
}

  
})
const User=mongoose.model('User',userSchema);
module.exports=User;