const dotenv = require('dotenv').config();
const express = require('express');
const app = express();


//session package
const session = require('express-session');
const passport = require('passport');




//db connection
require('./config/database',{
    useUnifiedTopology:true,
    userCreateIndex:true,
    useFindandModify:false});

    const MongoDBStore = require('connect-mongodb-session')(session);
    
    const sessionStore = new MongoDBStore({
uri:process.env.MONGODB_CONNECTION_STRING,
collection:'sessions'
    });


    //Session creating
    app.use(session({
        secret:process.env.SESSION_SECRET,
        resave:false,
        saveUninitialized:true,
        cookie:{
            maxAge:1000*60*60*24,
        },
        //sessions save database 
        store:sessionStore
    }));


    app.use(passport.initialize());
    app.use(passport.session());

    const authRouter = require('./routers/auth_router');
    const yonetimRouter = require('./routers/yonetim_router');


    // read get form varibales 
    app.use(express.urlencoded({extended:true}));
    

let count =0;
app.get('/',(req,res)=>{
    if(req.session.sayac){
        req.session.sayac++;
    }else{
        req.session.sayac = 1;
    }
    res.json({sayacim:req.session.sayac});
});

app.use(express.json());
app.use('/',authRouter);
app.use('/yonetim',yonetimRouter);



app.listen(process.env.PORT,()=>{

    console.log(`Server ${process.env.PORT} is up`);
});