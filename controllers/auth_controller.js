const passport = require('passport');
const User = require('../models/user_model');
//Sent require parameter to password_local
require('../config/password_local')(passport);
const bcrypt = require('bcrypt');
const nodemailer =require('nodemailer');
const jwt =require('jsonwebtoken');



//Login

const login=(req,res,next)=>{

    passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect:'/login',
        failureFlash:true
    })(req,res,next);

}


//Register

const getRegister =  (req,res,next) =>{


return res.json({message:"Register Get"});
}

const register= async (req,res,next)=>{


console.log("Register  " + `${req.body.email}`);

const {name,surname,email,password} =req.body;
   
if(!name ||!surname||!email||!password){

 return res.json({message:"Please fill in the fields"});
}else{
    try{
        console.log("TRY");
        const _user = await User.findOne({email:req.body.email});
        
        if(_user && _user.emailAktif == true){
            console.log("İF");
            console.log('email' + req.body.email + 'This email has already been registered');
    
        }else if((_user && _user.emailAktif ==false)|| _user ==null){
          
console.log("Else  " + `${req.body.surname}`);

            if(_user){
                await User.findOneAndRemove({_id:_user._id})
            }
            const newUser = new User({
                name,
                surname,
                email,
                password:await bcrypt.hash(req.body.password,10),
            });
    
            await newUser.save();
           console.log('Please check your email box');
       
       
       

       const jwtBilgileri ={
        id:newUser.id,
        email:newUser.email,
       };

       const jwtToken =jwt.sign(jwtBilgileri,process.env.CONFIRM_MAIL_JWT_SECRET,{expiresIn:'1d'});
       
       console.log('JWT Token : ' + jwtToken);


       const url = process.env.WEB_SITE_URL+'verify?id='+jwtToken;
       console.log('Url to go' + url);

       let transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.GMAIL_USER,
            pass:process.env.GMAIL_PASSWORD
        }
       });

       
       await transporter.sendMail({
        from:'Nodejs Application Onur Cebeci',
        to:newUser.email,
        subject:"Plase verify email",
        text:"Please click the link to confirm your email : " + url
       },(error,info)=>{
        if(error){
            console.log('Error ' + error);
        }

        console.log("Email sent" + info.toString );
        transporter.close();
       })
       
       
          res.redirect('/');




        }
    
    
    }catch(err){
        console.log("catch");
            return res.json({errorrr:err});
    }
}
}



const verifyMail = (req,res,next)=>{

    const token = req.query.id;
    if(token){

        try{
            jwt.verify(token,process.env.CONFIRM_MAIL_JWT_SECRET,async(e,decoded)=>{

                if(e){
                    res.json({error_message:"Token not correct or Expired = " + e});
                   // res.redirect('/register');
                }else{
                    const tokenIcindekiIdDegeri = decoded.id;
                    const sonuc = await User.findByIdAndUpdate(tokenIcindekiIdDegeri,{
                        emailAktif:true});

                        if(sonuc){
                                res.json({success_message:"Mail Successfully Confirmed"});
                                //res.redirect('/');
                        }else{
                             throw res.json('Please try to create a new record')       
                        }
                }

            });

        }catch(err){
                console.log(err);
        }
    }else {
        console.log('Token cannot found');
    }


}




//logout

const logout = (req,res,next)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
      });

      //connect.sid with fetch cookie id 
      res.clearCookie('connect.sid');
    

        console.log("Logout");
}


//ForgetPassword

const forgetPassword= async (req,res,next)=>{

    const _user = await User.findOne({email:req.body.email,emailAktif:true});

    if(_user){
        //Password reset email can be sent to the user
        const jwtBilgileri = {
            id:_user._id,
            email:_user.email
        };
        const secret = process.env.RESET_PASSWORD_JWT_SECRET+"-"+_user.password;
        const jwtToken =jwt.sign(jwtBilgileri,secret,{expiresIn:'1h'});

        const url = process.env.WEB_SITE_URL+'reset-password/'+_user._id+"/"+jwtToken;
        console.log('Url  to go ' + url);
 
        let transporter = nodemailer.createTransport({
         service:'gmail',
         auth:{
             user:process.env.GMAIL_USER,
             pass:process.env.GMAIL_PASSWORD
         }
        });
 
        
        await transporter.sendMail({
         
         from:'Nodejs App Onur Cebeci',
         to:_user.email,
         subject:"Password Update Link",
         text:"Click on the link to reset the password : " + url
        },(error,info)=>{
         if(error){
             console.log('Error : ' + error);
         }
 
         console.log("Mail sent  " + info.toString );
         transporter.close();
        })
        
    }else{

        throw res.json({message:"No account found for this e-mail."})

    }

}




const newPassword = async (req,res,next)=>{

  try{

    const _bulunanUser = await User.findOne({_id:req.body.id,emailAktif:true});
        
    const secret = process.env.RESET_PASSWORD_JWT_SECRET+"-"+_bulunanUser.password;
   
   
        jwt.verify(req.body.token,secret, async(e,decoded)=>{

            if(e){
               throw res.json({error_message:"Token Hatalı veya Süresi Geçmiş = " + e});
               // res.redirect('/register');
            }else{
                
                const hashedPassword = await bcrypt.hash(req.body.password,10);
                const sonuc = await User.findByIdAndUpdate(req.body.id,{pasword:hashedPassword});
                if(sonuc){
                    res.json({succes:"İşlem Başarılı"});
                }else{
                   throw res.json({succes:"İşlem gerçekleştirilemedi lütfen tekrar deneyin"});
                }
            }

        });

  }catch(err){
    throw res.json({error_message:"İşlem hatalı : " + err})
  }


}



const  changeYourPassword = async (req,res,next)=>{
  
    const LinkId = req.params.id;
    const LinkToken = req.params.token;

    if(LinkId&&LinkToken){

        const _userFound = await User.findOne({_id:LinkId});
        
        const secret = process.env.RESET_PASSWORD_JWT_SECRET+"-"+_userFound.password;
       
        try{
            jwt.verify(LinkToken,secret, async(e,decoded)=>{

                if(e){
                   throw res.json({error_message:"Token Incorrect or Expired = " + e});
                   // res.redirect('/register');
                }else{
                    
                     res.json({message:"PasswordScreen can show "})
               
                }

            });

        }catch(err){
                console.log(err);
        }
    

    }else{
        res.json({message:"Please Click The Link In The Mail Token Not Found"});
        res.redirect('forget-password');
    }
}



module.exports ={

    register,
    login,
    forgetPassword,
    getRegister,logout,
    verifyMail,
   changeYourPassword,
    newPassword

}