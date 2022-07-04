function admin(req,res,next){
   if(req.session.employee==null) return  res.render('error',{errCode:400,message:'Login As Admin First'});
    if(req.session.employee.role!="admin") return  res.render('error',{errCode:403,message:'You Are Not Authorized'});
    next();
}

module.exports=admin;