const express=require('express')
const fs = require('fs')
const multer = require('multer')
const path=require('path')
const Author = require('../models/Author')
const Book = require('../models/Book')
const router=express.Router()
const uploadPath= path.join('public', Book.coverImageBasePath);
const imageMimeTypes=['image/jpeg','image/png','image/gif']
const upload=multer({
   dest:uploadPath,
   fileFilter:(req,file,callback)=>{
      callback(null,imageMimeTypes.includes(file.mimetype) )
   }
})

//All books route
router.get('/',async(req,res)=>{
   res.send('All books')
   
})

//New book route
router.get('/new',async(req,res)=>{
   renderNewPage(res,new Book())
  
 })

//Create book route
router.post('/',upload.single('cover'),async(req,res)=>{
   const fileName=req.file? req.file.filename : null;
   const book = new Book({
      title:req.body.title,
      author:req.body.author,
      publishDate:new Date(req.body.publishDate),
      pageCount:req.body.pageCount,
      description:req.body.description,
      coverImageName:fileName
   })
   try{
      const newBook= await book.save();
      // res.redirect(`books/${book.id}`)
          res.redirect(`/books`)
        
    }
    catch{
       if(book.coverImageName){
          removeBookCover(book.coverImageName)
       }
      renderNewPage(res,book,true);
    }
   
    
 }) 
 function removeBookCover(fileName){
    fs.unlink(path.join(uploadPath,fileName),err=>{
    if(err){console.error(err)}
    })
 }

 async function renderNewPage(res,book,hasError=false){
   try{
      const authors= await Author.find({})
      const params={authors,book}
      if(hasError) params.errorMsg='Error creating book'
      res.render('books/new',params)
   }
   catch{
      res.redirect('/books')
   }

 }




module.exports=router;