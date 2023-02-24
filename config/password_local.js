const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const User =require('../models/user_model');
const bcrypt = require('bcrypt');

module.exports = function (passport) {
   
    const options = {
        usernameField:'email',
        passwordField:'password'
        
    }

    passport.use(new LocalStrategy(options,async(email,password,done)=>{

            try{
                    const _foundUser = await User.findOne({email:email});
                    if(!_foundUser){
                        return done(null,false,{message:"User cannot found"});
                    }

                    const passwordcontrol = await bcrypt.compare(password,_foundUser.passport);
                    if(!passwordcontrol){
                        return done(null,false,{message:"Password false"});
                    }else{

                        if(_foundUser && _foundUser.emailAktif == false){
                            return done(null,false,{message:"Plase Validate Email"});
                        }else{
                            return  done(null,_foundUser,{message:"User Login**"});
                        }
                            
                        
                    }


                  
               

            }catch(err){
                    return done(err);
            }

    }));


    passport.serializeUser(function(user,done){
        console.log("Save to Session "+ user.id);
        done(null,user.id);

    });
    

    passport.deserializeUser(function(id,done){
        console.log("Id Save to Session  "+ id);
       User.findById(id,function(err,user){
            done(err,user);
       });

    });
}
