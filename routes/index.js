var express = require('express');
var router = express.Router();
var resultspath = require('../resultspath').results;
var allrespath = require('../resultspath').allrespath;
var map = [];
var fs = require('fs');
var pdfjs = require('pdfjs-dist');
var p = 1;
var data = new Uint8Array(fs.readFileSync(allrespath+'/btech22.pdf'));
var myresult = require('../myresult');
var credstore = require('../credstore/credstore')


pdfjs.getDocument(data).then(function (pdfDocument) {
  for(var i=1;i<=pdfDocument.numPages;i++){
    pdfDocument.getPage(i).then(function (page) {
      //  console.log(page._buffer);
      page.getTextContent().then(function (textcontent) {

      var r= textcontent.items[8].str.replace(' ','');
        map.push(r);
        console.log(r+' --- index: '+p++);
      });
    })
  }
});

var loggedIn =[]
/* GET home page. */
router.get('/', function(req, res, next) {
//  res.render('index', { title: 'My Exam Result' });
//res.redirect('/login');
res.render('welcome',{title:'My Exam Result'});
});

router.get('/login',function (req,res,next) {
  res.render('login', { title: 'My Exam Result' });
})
router.post('/login',credstore.logMeIn,function (req,res,next) {
  res.redirect('/myresult');

})
router.get('/signup/:rolln',function (req,res,next) {
  res.render('signup',{title:'My Exam Result',rolln:req.params.rolln})
})
router.get('/signup',function (req,res,next) {
  res.render('signup',{title:'My Exam Result',rolln:''})
})
router.post('/signup',parserolln,credstore.signMeUp,function (req,res,next) {
  res.redirect('/myresult');
})

router.get('/myresult',credstore.getMySession,function (req,res,next) {
  res.render('myresult',{title:'My Exam Result',rolln:loggedIn[0]})
})

router.get('/logout',function (req,res,next) {

  res.redirect('/');
});

router.get('/downloadresult',credstore.getMySession,findmypage,myresult.getMyResult,function (req,res,next) {
  var thePath =require('path').join(resultspath,req.mine.filename)
  res.sendFile(thePath);
  myresult.deleteInTen(thePath);
})

/*
router.post('/', parserolln,findmypage,myresult.getMyResult,function(req, res, next) {
  var thePath =require('path').join(resultspath,req.mine.filename) 
  res.sendFile(thePath);
  myresult.deleteInTen(thePath);
  
});
*/
function parserolln(req,res,next) {
  if(req.body.rolln && req.body.rolln.length == 10){
    req.body.rolln = req.body.rolln.toUpperCase();
    next();
  }else{
   res.render('err', {title:'My Exam Result',err:'Invalid Roll number',suggestion:'Check that roll number and try again',pageName:'Login',pageLink:'/login'});
  //  res.redirect('/')
  }
}
function findmypage(req,res,next) {
  if(map.indexOf(req.rolln) != -1){
    req.page = map.indexOf(req.rolln) + 1
    console.log(req.page);
    next()
  }else{
    res.render('err', {title:'My Exam Result',err:'result not found',suggestion:'please try again later',pageName:'My results',pageLink:'/myresult'});
  }
}

module.exports = router;
