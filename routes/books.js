const express=require('express')
const fs = require('fs')
//const multer = require('multer')
const path=require('path')
const Author = require('../models/Author')
const Book = require('../models/Book')
const router=express.Router()
//const uploadPath= path.join('public', Book.coverImageBasePath);
const imageMimeTypes=['image/jpeg','image/png','image/gif']
/*const upload=multer({
   dest:uploadPath,
   fileFilter:(req,file,callback)=>{
      callback(null,imageMimeTypes.includes(file.mimetype) )
   }
})*/

//All books route
router.get('/',async(req,res)=>{
   let query = Book.find()
   if(req.query.title){
      query=query.regex('title',new RegExp(req.query.title,'i'))
   }
   if(req.query.publishedBefore){
      query=query.lte('publishDate',req.query.publishedBefore)
   }
   if(req.query.publishedAfter){
      query=query.gte('publishDate',req.query.publishedAfter)
   }
   try{
      const books =await query.exec();
      res.render('books/index',{books,searchOptions:req.query})
   }
   catch{
      res.redirect('/')
   }
   
})

//New book route
router.get('/new',async(req,res)=>{
   renderNewPage(res,new Book())
  
 })

//Create book route
router.post('/',/*upload.single('cover'),*/async(req,res)=>{
   //const fileName=req.file? req.file.filename : null;
   const book = new Book({
      title:req.body.title,
      author:req.body.author,
      publishDate:new Date(req.body.publishDate),
      pageCount:req.body.pageCount,
      description:req.body.description,
    //  coverImageName:fileName
   })
   saveCover(book,req.body.cover)
   try{
      const newBook= await book.save();
       res.redirect(`/books/${book.id}`)
         // res.redirect(`/books`)
        
    }
    catch{
      /* if(book.coverImageName){
          removeBookCover(book.coverImageName)
       }*/
      renderNewPage(res,book,true);
    }
   
    
 }) 
 /*function removeBookCover(fileName){
    fs.unlink(path.join(uploadPath,fileName),err=>{
    if(err){console.error(err)}
    })
 }*/
//Show book route
 router.get('/:id',async(req,res)=>{
   
   try{
    const book=await Book.findById(req.params.id)
                         .populate('author')
                         .exec();
    
    res.render('books/show',{book})
   }
   catch{
      res.redirect('/')
 
   }
 })
 //New book route
router.get('/:id/edit',async(req,res)=>{
   try{
      const book=await Book.findById(req.params.id) 
   renderEditPage(res,book)
   }
   catch{
      res.redirect('/');
   }
  
 })

 //Update book route
router.put('/:id',async(req,res)=>{
   let book
   
   try{
     book=await Book.findById(req.params.id);
     book.title=req.body.title
     book.author=req.body.author
     book.publishDate=new Date(req.body.publishDate)
     book.pageCount=req.body.pageCount
     book.description=req.body.description
     if(req.body.cover){
      saveCover(book,req.body.cover)
   }
   await book.save();
       res.redirect(`/books/${book.id}`)
         
        
    }
    catch{
      if(book) renderEditPage(res,book,true);
      else{
         res.redirect('/')
      }
     
    }
   
    
 }) 
 //delete book route
 router.delete('/:id',async(req,res)=>{
   let book
    try{
         book= await Book.findById(req.params.id)
         await book.remove()
         res.redirect(`/books`)
           // res.redirect(`/authors`)
          
      }
      catch{
          if(!book){
              res.redirect('/')
          }
          else{
            res.render('books/show',{book,errorMsg:'Couldn\'t remove book'})

          }
        
      }

   })

 async function renderNewPage(res,book,hasError=false){
   renderFormPage(res,book,'new',hasError)
 }

 async function renderEditPage(res,book,hasError=false){
  renderFormPage(res,book,'edit',hasError)

 }

 async function renderFormPage(res,book,form,hasError=false){
   try{
      const authors= await Author.find({})
      const params={authors,book}
      if(hasError){
         if(form==='edit'){params.errorMsg='Error updating book'}
         else {
            params.errorMsg='Error creating book'
         }
      } 
      res.render(`books/${form}`,params)
   }
   catch{
      res.redirect('/books')
   }

 }

 function saveCover(book, coverEncoded){
    if(!coverEncoded) return
    const cover = JSON.parse(coverEncoded);
    if(cover && imageMimeTypes.includes(cover.type) ){
       book.coverImage=new Buffer.from(cover.data, 'base64');
       book.coverImageType=cover.type
    }
 }




module.exports=router;