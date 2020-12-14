const express=require('express')
const Author = require('../models/author')
const router=express.Router()

//All authors route
router.get('/',async(req,res)=>{
   try{
      let searchOptions={}
      if(req.query.name != null && req.query.name != ''){
         searchOptions.name=new RegExp(req.query.name,'i')
      }
      const authors= await Author.find(searchOptions)
      res.render('authors/index.ejs',{authors,
                                      searchOptions:req.query})
   } 
   catch{
      res.redirect('/')
   } 
   
})

//New authors route
router.get('/new',(req,res)=>{
  
    res.render('authors/new.ejs',{author:new Author()})
 })

//Create author route
router.post('/',async(req,res)=>{
    const author=new Author({name:req.body.name})

    try{
      const newAuthor= await author.save();
      // res.redirect(`authors/${author.id}`)
          res.redirect(`/authors`)
    }
    catch{
      res.render('authors/new.ejs', {
                   author,
                   errorMsg:'Error creating author'})
    }


  /*  author.save((err,newAuthor)=>{
       if(err){
          res.render('authors/new.ejs', {
             author,
             errorMsg:'Error creating author'})
       }
       else{
         // res.redirect(`authors/${author.id}`)
         res.redirect(`/authors`)
       }
     })*/
    
 }) 




module.exports=router;