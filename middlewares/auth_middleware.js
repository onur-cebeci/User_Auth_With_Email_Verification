
const isActive = (req,res,next)=>{


    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect('/login');
    }
}


const isActiveFalse = (req,res,next)=>{


    if(!req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect('/');
    }
}

module.exports ={
    isActive,
   isActiveFalse,
}
