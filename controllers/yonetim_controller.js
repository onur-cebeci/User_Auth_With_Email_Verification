const showHomePage =  function(req,res,next){

    res.json({message:'Home Page'})

}

module.exports = {
  showHomePage,
}