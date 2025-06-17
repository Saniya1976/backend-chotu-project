const express=require('express');
const router=express.Router();



router.get('/',(req,res)=>{
    res.send('User Home Page');
});
router.get('register',(req,res)=>{
    res.render('register');
})
router.post('register',(req,res)=>{
    const{name,email,password}=req.body;
    // Here you would typically save the user to a database
    console.log(`User Registered: ${Username}, ${email}`);  
    res.send('User Registered Successfully');
})
module.exports=router;


