const express=require('express')
const Author = require('../models/author')
const router=express.Router()

//All authors route
router.get('/',(req,res)=>{
  
   res.render('authors/index.ejs')
})

//New authors route
router.get('/new',(req,res)=>{
  
    res.render('authors/new.ejs',{author:new Author()})
 })

//Create author route
router.post('/',(req,res)=>{
    const author=new Author({name:req.body.name})
    author.save((err,author)=>{
       if(err){
          res.render('authors/new.ejs', {
             author,
             errorMsg:'Error creating author'})
       }
       else{
         // res.redirect(`authors/${author.id}`)
         res.redirect(`/authors`)
       }
    })
    
 }) 




module.exports=router;