const express=require('express');
const server=express();
const userRoutes=require('./routes/user.routes');

server.use(express.json());
server.use(express.urlencoded({extended:true}));

server.set('view engine','ejs');
server.set('views','./views');


server.get('/',(req,res)=>{
    res.render("index");
})
server.get('/user/register',(req,res)=>{
    res.render('register');
})
server.use('/user',userRoutes);



server.listen(3000,()=>{
    console.log('Server is running on port http://localhost:3000');
});