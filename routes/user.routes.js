const express=require('express');
const router=express.Router();

router.get('/',(req,res)=>{
    res.send('User Home Page');
});
router.get('/register',(req,res)=>{
    res.render('register');
});
router.post('/user/register',(req,res)=>{
    const{Username,email,password}=req.body;
    console.log(`User Registered: ${Username}, ${email}`);  
    res.render('signin');
})
module.exports=router;


