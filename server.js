if(process.env.NODE_ENV!=="production"){
    require('dotenv').config()
}

const express=require('express');
const app=express();

const expressLayouts=require('express-ejs-layouts');

const methodOverride=require('method-override')

//dfgdfgdgd

app.set('view engine','ejs')
app.set('layout','layouts/layout')
app.use(expressLayouts);

app.use(methodOverride('_method'))

app.use(express.static('public'))
app.use(express.urlencoded({extended:false,limit:'10mb'}))

const mongoose=require('mongoose')
mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser:true,useUnifiedTopology:true})
const db=mongoose.connection
db.on('error',error=>console.error(error));
db.once('open',()=>console.log('Connected to mongoDB..'))

const indexRouter=require('./routes/index')
app.use('/',indexRouter)

const authorRouter=require('./routes/authors')
app.use('/authors',authorRouter)

const bookRouter=require('./routes/books')
app.use('/books',bookRouter)

app.listen(process.env.PORT ||8080,()=>{console.log("Listening...");})