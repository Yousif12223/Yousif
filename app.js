var createError = require('http-errors');
var fs=require('fs');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session=require('express-session');
const bodyparser=require('body-parser');

var app = express();
var old=(JSON.parse(fs.readFileSync('users.json')));
var favourites=(JSON.parse(fs.readFileSync('favourites.json')));
var books=(JSON.parse(fs.readFileSync('books.json')));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

  //this is session variable
    const two=1000*60*60*2;
    const {
      ssname='sid',
      Lifetime=two
    }=process.env;
    
    app.use(session({
      
     // name:ssname,
      resave:false,
      saveUninitialized:true,
      secret:'ssh!,im a secret',
      //logged:false,
     
     
    }));
    function redirecthome(req,res){
      if(req.session.user!=null)
        res.redirect('/home')
    }
    function auth(req,res){
  
      console.log(req.session.user);
      if((req.session.user==undefined))
        res.redirect('/');
    }
    
    
    app.get('/',function(req, res, next) {
      flag=false;
      old.forEach(element=>{
        if(req.session.user==element.x){
          
          res.redirect('/home');
        }
      });
      if(!flag)
         res.render('login', { message: '' });
    });
          
    app.post('/',function(req,res,next){
        var x=req.body.username;
        var y=req.body.password;
        var flag=false;
        favs=[];
          old.forEach(element => {
           // console.log(x.toString()==(element.x).toString()&&y.toString()==(element.y).toString());
            if(x.toString()==(element.x).toString()&&y.toString()==(element.y).toString()){
              fs.writeFileSync('current.json',JSON.stringify({x,favs}));
              req.session.user=element.x;
              req.session.save();
              flag=true;
             // req.session.user!=null=true;
              favourites=(JSON.parse(fs.readFileSync('favourites.json')));
              res.redirect('/home');
            }
      
          });
        if(req.session.user==undefined)
          res.render('login',{message:'Please Enter a valid username / password'})
          
    }); 
    

    app.get('/registration',function(req,res,next){
      redirecthome(req,res);
      if(req.session.user==null)
       res.render('registration.ejs',{message:''});
    });
    app.post('/registration',function(req,res,next){
      favs=[];
      var found=false;
      var x=req.body.username;
      var y=req.body.password;
      var user =[{x,y}];
      var fav=[{x,favs}] 
      if(x!=""){
      try{
          var olds=(JSON.parse(fs.readFileSync('users.json')));
          var oldfavs=(JSON.parse(fs.readFileSync('favourites.json')));
          olds.forEach(element =>{
              if(x==element.x){
                  found=true;
                  res.render('registration.ejs',{message:'please enter another username'});
                  return;
              }
          });
        }catch{
          olds=[];
          oldfavs=[];
        }
      if(!found){  
         fs.writeFileSync('users.json',JSON.stringify(olds.concat(user)));
         fs.writeFileSync('favourites.json',JSON.stringify(oldfavs.concat(fav)));
         res.render('registration',{message:'Your Response Has Been Recorded , Click Here To login'});
        }
        old=(JSON.parse(fs.readFileSync('users.json')));}
        else{
          res.render('registration.ejs',{message:'please enter another username'});
        }
      next();
  });
  
  //home app

app.get('/home', function(req, res, next) {
    console.log("f "+req.session.user);
    auth(req,res);
     console.log(!req.session.user==null)
     if(req.session.user!=null)
      res.render('home',{username:req.session.user.toUpperCase()});
});

//books apps

app.get('/dune',function(req,res,next){
  auth(req,res);
  if(req.session.user!=null)
   res.render('dune',{added:''});
})
app.post('/dune',function(req,res,next){
    console.log(favourites);
    favourites.forEach(element=>{
      if(req.session.user==element.x){
        if(!element.favs.includes('dune')){
          element.favs[element.favs.length]='dune';
          newfiv=JSON.stringify(favourites);
          fs.writeFileSync('favourites.json',newfiv);
          res.render('dune',{added:'Added Sucssesfully'});
      }else{
        res.render('dune',{added:'Already Included'});
      }
    }
    });
    
})

app.get('/fiction',function(req,res,next){
  auth(req,res);
  if(req.session.user!=null)
  res.render('fiction',{added:''});
})

app.get('/flies',function(req,res,next){
  auth(req,res);
  if(req.session.user!=null)
   res.render('flies',{added:''});
})

app.post('/flies',function(req,res,next){
  console.log(favourites);
  favourites.forEach(element=>{
    if(req.session.user==element.x){
      if(!element.favs.includes('flies')){
        element.favs[element.favs.length]='flies';
        newfiv=JSON.stringify(favourites);
        fs.writeFileSync('favourites.json',newfiv); 
        res.render('flies',{added:'Added Sucssesfully'});
    }else{
      res.render('flies',{added:'Already Included'});
    }
  }
  });
  
});

app.get('/grapes',function(req,res,next){
  auth(req,res);
  if(req.session.user!=null)
   res.render('grapes',{added:''});
})

app.post('/grapes',function(req,res,next){
  console.log(favourites);
  favourites.forEach(element=>{
    if(req.session.user==element.x){
      if(!element.favs.includes('grapes')){
        element.favs[element.favs.length]='grapes';
        newfiv=JSON.stringify(favourites);
        fs.writeFileSync('favourites.json',newfiv);
        res.render('grapes',{added:'Added Sucssesfully'});
    }else{
      res.render('grapes',{added:'Already Included'});
    }
  }
  });

  
});

app.get('/leaves',function(req,res,next){
  auth(req,res);
  if(req.session.user!=null)
   res.render('leaves',{added:''});
})

app.post('/leaves',function(req,res,next){
  console.log(favourites);
  favourites.forEach(element=>{
    if(req.session.user==element.x){
      if(!element.favs.includes('leaves')){
        element.favs[element.favs.length]='leaves';
        newfiv=JSON.stringify(favourites);
        fs.writeFileSync('favourites.json',newfiv);    
        res.render('leaves',{added:'Added Sucssesfully'});
    }else{
      res.render('leaves',{added:'Already Included'});
    }
  }
  });
  
});

app.get('/mockingbird',function(req,res,next){
  auth(req,res);
  if(req.session.user!=null)
   res.render('mockingbird',{added:''});
})

app.post('/mockingbird',function(req,res,next){
  console.log(favourites);
  favourites.forEach(element=>{
    if(req.session.user==element.x){
      if(!element.favs.includes('mockingbird')){
        element.favs[element.favs.length]='mockingbird';
        newfiv=JSON.stringify(favourites);
        fs.writeFileSync('favourites.json',newfiv);
        res.render('mockingbird',{added:'Added Sucssesfully'});
    }
    else{
        res.render('mockingbird',{added:'Already Exists'});
    }
  }
  });
  
});

app.get('/novel', function(req, res, next) {
  auth(req,res);
  if(req.session.user!=null)
    res.render('novel', { message: '' });
});

app.get('/poetry',function(req,res,next){
  auth(req,res);
  if(req.session.user!=null)
  res.render('poetry');
})


app.get('/sun',function(req,res,next){
 
  auth(req,res);
  if((req.session.user!=null))
   res.render('sun',{added:''});
})

app.post('/sun',function(req,res,next){
  //console.log(favourites);
  favourites.forEach(element=>{
    if(req.session.user==element.x){
      if(!element.favs.includes('SUN')){
        element.favs[element.favs.length]='SUN';
        newfiv=JSON.stringify(favourites);
        fs.writeFileSync('favourites.json',newfiv);
        res.render('sun',{added:'Added Sucssesfully'});
    }
    else{
        res.render('sun',{added:'already included'})
    }
  }
  });
  
});

app.get('/search',function(req,res,next){
  auth(req,res);
  res.render('searchresults',{ourlist:[],added:""});

})


app.post('/search',function(req,res,next){
  var sear=(req.body.Search).toLowerCase();
  var result=[];
  var f=false;
  books.forEach(element=>{
    console.log(element.bookname);
    console.log(typeof element.bookname);
    console.log(sear);
    console.log(typeof sear);
    console.log(element.bookname.includes(sear))
    if(element.bookname.toLowerCase().includes(sear)){
      var obj={name:element.bookname,val:element.bookvalue};
      result.push(obj);
      f=true;
    }
  });
  if(f){
    res.render('searchresults',{ourlist:result,added:""})
  }else{
    res.render('searchresults',{ourlist:[],added:"Not Found"});
  }


});

app.get('/readlist', function(req, res, next) {
  auth(req,res);
  var passedarr=[];
  favourites.forEach(element=>{
    if(req.session.user==element.x)
      passedarr=element.favs;
  })
  console.log(passedarr);
  res.render('readlist',{ourlist:passedarr});
});


const port =process.env.PORT||3000;
app.listen(port);
module.exports = app;