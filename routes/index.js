var express = require('express');
const bcrypt = require('bcryptjs');
var router = express.Router();
var employees = require("../models/employee");
var admin = require('../middlewares/admin');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/logout',function(req,res){
  req.session.employee=null
  res.redirect('/login')
});


router.get('/userProfile',async function(req, res, next) {
  if(req.session.employee==null)  res.render('error',{errCode:400,message:'Login First'})
  let admin = req.session.employee;
  res.render('userProfile', {admin});
});

router.get('/userProfile/:id',async function(req, res, next) {
  let employee =await employees.findById(req.params.id);
  let admin = req.session.employee;
  res.render('userProfile' ,{employee, admin});
});


router.get('/basic/:id',async function(req, res, next) {
  let employee =await employees.findById(req.params.id);
  res.render('basic', {employee})
});

router.post('/basic/:id',async function(req, res, next) {
  console.log(req.params.id);
  let employee =await employees.findById(req.params.id);
  employee.name=req.body.name;
  employee.cnic=req.body.cnic;
  employee.email=req.body.email;
  employee.contact=req.body.contact;
  employee.gender=req.body.gender;
  employee.address=req.body.address;
  employee.dob=req.body.dob;
  employee.salary=req.body.salary;
  employee.post=req.body.post;
  await employee.save();
  res.redirect('/userProfile/'+req.params.id);
});


router.get('/jobDes/:id',async function(req, res, next) {
  let employee =await employees.findById(req.params.id);
  res.render('jobDes', {employee})
});

router.post('/jobDes/:id',async function(req, res, next) {
  let employee =await employees.findById(req.params.id);
  employee.jobdes=req.body.jobdes;
  await employee.save();
  res.redirect('/userProfile/'+req.params.id);
});

// router.get('/userProfile/basic/:id',async function(req, res, next) {
//   let employee =await employees.findById(req.params.id);
//   res.render('basic', {employee})
// });


router.get('/login',function(req,res){
  res.render('login');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});


router.post('/register',async function(req, res, next) {
  let employee=await employees.findOne({email:req.body.email})
  if (employee) return res.render('error',{errCode:400,message:'Employee Already Registered'});
  console.log(req.body);
  employee = new employees(req.body)
  employee.name=req.body.name;
  employee.cnic=req.body.cnic;
  employee.email=req.body.email;
  employee.contact=req.body.contact;
  employee.gender=req.body.gender;
  employee.address=req.body.address;
  employee.dob=req.body.dob;
  let salt=await bcrypt.genSalt(10);
   employee.password=await bcrypt.hash(employee.password,salt);
  await employee.save();
  res.render('register');
});






router.post('/login', async function(req, res, next) {
  let employee=await employees.findOne({email:req.body.email})
  if (!employee) return  res.render('error',{errCode:400,message:'Employee Not Found'});
  req.session.employee=employee;
  let isvalid =await bcrypt.compare(req.body.password ,employee.password);
  if (!isvalid) return  res.render('error',{errCode:401,message:'Invalid Password'});
  res.redirect('/userProfile');
});


router.get('/allEmp',admin,async function(req, res, next) {
  let employee=await employees.find();
  let admin=req.session.employee;
  res.render('allEmp', {employee, admin});
});


router.get('/allEmp/delete/:id',async function(req, res, next) {
  console.log(req.params.id);
  let employee=await employees.findByIdAndDelete(req.params.id);
  res.redirect('/allEmp');
});

module.exports = router;
