const express=require('express')
const Author = require('../models/Author')
const Book = require('../models/Book')
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
   catch(e){

      res.render('index.ejs',{errorMsg:e,books:[]})
     //res.redirect('/')
   } 
   
})

//New author route
router.get('/new',(req,res)=>{
  
    res.render('authors/new.ejs',{author:new Author()})
   
 })

//Create author route
router.post('/',async(req,res)=>{
    const author=new Author({name:req.body.name})

    try{
      const newAuthor= await author.save();
       res.redirect(`/authors/${author.id}`)
         // res.redirect(`/authors`)
        
    }
    catch{
      res.render('authors/edit.ejs', {
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

 router.get('/:id',async(req,res)=>{
   
  try{
   const author=await Author.findById(req.params.id);
   const booksByAuthor=await Book.find({author:author.id}).limit(6).exec();
   res.render('authors/show',{author,booksByAuthor})
  }
  catch{
     res.redirect('/')

  }
})
router.get('/:id/edit',async(req,res)=>{
    try{

    const author=await Author.findById(req.params.id);
    res.render('authors/edit.ejs',{author})
    }
    catch{
        res.redirect('/authors')
    }
  
})
router.put('/:id',async(req,res)=>{
    let author
    try{
         author= await Author.findById(req.params.id)
         author.name=req.body.name;
         await author.save()
         res.redirect(`/authors/${author.id}`)
           // res.redirect(`/authors`)
          
      }
      catch{
          if(!author){
              res.redirect('/')
          }
          else{
            res.render('authors/new.ejs', {
                author,
                errorMsg:'Error creating author'})

          }
        
      }
})
router.delete('/:id',async(req,res)=>{
   let author
    try{
         author= await Author.findById(req.params.id)
         await author.remove()
         res.redirect(`/authors`)
           // res.redirect(`/authors`)
          
      }
      catch{
          if(!author){
              res.redirect('/')
          }
          else{
            res.redirect(`/authors/${author.id}`)

          }
        
      }

   })


module.exports=router;