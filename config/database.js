const mongoose = require('mongoose');



mongoose.set('strictQuery',false)

mongoose.connect(process.env.MONGODB_CONNECTION_STRING).then(()=>{

    
    console.log('Connection Database');
}).catch(err=> console.log(`Database Connetion Error : ${err}`));
