const express=require('express');
const app=express();

const expressLayouts=require('express-ejs-layouts');

//dfgdfgdgd

app.set('view engine','ejs')
app.set('layout','layouts/layout')
app.use(expressLayouts);


app.use(express.static('public'))
const router=require('./routes/index')
app.use('/',router)

app.listen(process.env.PORT ||3000,()=>{console.log("Listening...");})