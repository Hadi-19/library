const express=require('express')
const router=express.Router()

//All authors route
router.get('/',(req,res)=>{
  
   res.render('authors/index.ejs')
})

//New authors route
router.get('/new',(req,res)=>{
  
    res.render('authors/new.ejs')
 })

//Create author route
router.post('/',(req,res)=>{
  
    res.send('Create')
 }) 




module.exports=router;