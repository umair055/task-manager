function sessionAuth(req,res,next){
    
    res.locals.employee = req.session.employee;
    next();
};

module.exports=sessionAuth;