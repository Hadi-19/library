const express=require('express')
const router=express.Router()

router.get('/',(req,res)=>{
   // res.send('<center><h1>hello</h1></center>')
   res.render('index.ejs')


})
module.exports=router;