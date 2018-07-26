var express = require('express');  //Using express module
var router = express.Router();   
var fs=require('fs');  

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Form Validation', success: req.session.success, errors: req.session.errors });
  req.session.errors = null;
});

//Going to registration page 
router.get('/registration_form', function(req, res, next) {
  res.render('registration_form');
  req.session.errors = null;
});

//Guiding to success page after registration
router.post('/success', function(req, res, next) {
  var a=req.body.username;
  res.render('registration_success');
  var a=req.body.username;
  var b=req.body.contact;
  var c=req.body.email;
  var d=req.body.uid;
  var e=req.body.id_no;
  var f=req.body.reason;
  var g=req.body.whom;
  
//Unique ID generation for new user
var gid
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
if(dd<10){
dd='0'+dd;
} 
if(mm<10){
mm='0'+mm;
} 

var hour
var min
var sec

hour = today.getHours()
min = today.getMinutes()
sec = today.getSeconds()

time = hour+''+min+''+sec

var date = yyyy+''+mm+''+dd;

gid = date+time;


//Establishing Connection with MYSQL
var mysql = require('mysql');
var con = mysql.createConnection({
host: "localhost",
user: "root",
password: "pict123",
database: "HR_PRODUCT"
});

//Function for inserting data into the database
con.connect(function(err) {
if (err) throw err;
console.log("Connected!");
var sql = "INSERT INTO Registration(Guest_ID,Username,Contact,Email,IDproof,ID_Number,Reason,Whom_to_meet,Date,CheckIn) VALUES ("+gid+","+"'"+a+"'"+","+"'"+b+"'"+","+"'"+c+"'"+","+"'"+d+"'"+","+"'"+e+"'"+","+"'"+f+"'"+","+"'"+g+"'"+","+'CURRENT_DATE()'+','+'CURTIME()'+")";
con.query(sql, function (err, result) {
if (err) throw err;
});
  req.session.errors = null;
});

var nodemailer = require('nodemailer');

var recipient = req.body.email;
console.log(recipient);

var transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
user: 'spartan4be@gmail.com',
pass: 'Spartan4BE'
}
});

var mailOptions = {
from: 'spartan4be@gmail.com',
to: recipient,
subject: 'Welcome!',
text: 'Hello '+a+', Welcome to e-Zest. Hope you have a great experience visiting us. Please feel free to write to write to us at info@e-zest.com. Your Guest ID is '+gid
};

transporter.sendMail(mailOptions, function(error, info){
if (error) {
console.log(error);
} else {
console.log('Email sent: ' + info.response);
}
});

});

router.post('/login_check', function(req, res, next) {
  var mob=req.body.contact;
  var mysql = require('mysql');
var con = mysql.createConnection({
host: "localhost",
user: "root",
password: "pict123",
database: "HR_PRODUCT"
});
  var sql="Select * from Registration where Contact = "+"'"+mob+"'";
  con.query(sql,function(err,result,fields)
  {
     if(err)
     {
         console.log("Error Occured");
     }
     else
     {
         if(result!=null)
         {
           console.log(result);
           res.render('registration_success');
           var a=result[0].Guest_ID;
           console.log(a);
           var b=result[0].Username;
           console.log(b);
           var c=result[0].Contact;
           var d=result[0].Email;
           var e=result[0].IDproof;
           var f=result[0].ID_Number;
           var g=req.body.reason;
           var h=req.body.whom;
           console.log(g);
           var sql2 = "INSERT INTO Registration(Guest_ID,Username,Contact,Email,IDproof,ID_Number,Reason,Whom_to_meet,Date,CheckIn) VALUES("+a+","+"'"+b+"'"+","+"'"+c+"'"+","+"'"+d+"'"+","+"'"+e+"'"+","+"'"+f+"'"+","+"'"+g+"'"+","+"'"+h+"'"+","+"CURRENT_DATE()"+","+"CURTIME()"+")";
           con.query(sql2,function(err3,result3,fields3)
           {
              if(err3)
              {
                console.log("Error occured in updating registration");
                throw err3;
              }
              else
              {
                 console.log(result3);
              }
           });
           var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
user: 'spartan4be@gmail.com',
pass: 'Spartan4BE'
}
});

var mailOptions = {
from: 'spartan4be@gmail.com',
to: d,
subject: 'Welcome!',
text: 'Hello '+b+', Welcome to e-Zest. Hope you have a great experience visiting us. Please feel free to write to write to us at info@e-zest.com. Your Guest ID is '+a
};

transporter.sendMail(mailOptions, function(error, info){
if (error) {
console.log(error);
} else {
console.log('Email sent: ' + info.response);
}
});
         
         }
         else
         {
           console.log("Not Working"); 
         }
     }  

  });
  req.session.errors = null;
});

//Code snippet for Login page
router.get('/login_form', function(req, res, next) {
  res.render('next_time_user');
  req.session.errors = null;
});

//Code snippet for Admin page
router.get('/admin_login', function(req, res, next) {
  res.render('admin_login2');
      });


router.post('/checkout', function(req, res, next) {
  res.render('checkout');
  //var a=req.body.contact;
  //console.log(a);
  req.session.errors = null;
});

//Code snippet for feedback page
router.post('/feedback', function(req, res, next) {
  res.render('feedback');
  var a=req.body.contact;
  var mysql = require('mysql');
  var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "pict123",
  database: "HR_PRODUCT"
  });
  var sql="Select * from Registration where Guest_ID = "+"'"+a+"'";
  con.query(sql,function(err,result,fields)
  {
    if(err)
      throw err;
    else
    {
      console.log("updating")
      var sql2="UPDATE Registration set CheckOut="+"CURTIME()"+" "+"WHERE Guest_ID="+"'"+a+"'"+"AND CheckOut IS NULL";
      con.query(sql2,function(err2,result2,fields2)
     {
    if(err2)
      throw err2;
    else
    {
       console.log("Done!");
    }
  });
  req.session.errors = null;
}
});
});

//Code Snippet for getting data onto Admin page
router.post('/get_data', function(req, res, next) {
        var mysql = require('mysql');
        var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "pict123",
        database: "HR_PRODUCT"
        });
        
        var user=req.body.username;
        var pass=req.body.password;
        var sql3="SELECT * FROM ADMIN where username ="+"'"+user+"'"+"AND password="+"'"+pass+"'";
        con.query(sql3,function(err2,result2,fields2)
        {
          if(err2)
          {
            console.log("Invalid Admin");
          }
          else
          {
             console.log("Valid Admin"); 
             con.end();

        //Code Snippet for diplaying data on admin page from MYSQL database
        fs.readFile("views/sample.hbs",function(error,pgResp)
        {
          if(error)
          {
            res.writeHead(404);
          }
          else
         {
          var con2 = mysql.createConnection({
          host: "localhost",
          user: "root",
          password: "pict123",
          database: "HR_PRODUCT"
         });
        
        
        res.writeHead(200,{'Content-Type':'text/html'});
        res.write('<link rel="stylesheet" href="admin_table.css">');
        res.write(' <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>');
        res.write('<script type="text/javascript">  function hide_init(){console.log("hiding"); $("#customers").hide();} </script>');

         /*res.write('<h2 align="center" >Guest Entry Table</h1>');
         res.write('<form action="chk_feedback" method="post"><button value="view_feedback">Check Feedback</button></form>');
         res.write('<div class="dropdown"><select name="filter" id="filter">');
         res.write('<button class="dropbtn">Dropdown</button>');
         res.write('<div class="dropdown-content" align="center"><a>Link1</a></div></div><br><br><br>');
         res.write('<form method="post"><input type="button" align="center" class="btn" onclick="hide_init()" value="Apply Filters"></form>');
         res.write('</select>');*/

         //res.write('<h2 align="center" >Guest Entry Table</h1>');

         /*res.write('<form action="chk_feedback" method="post"><button value="view_feedback">Check Feedback</button></form>');
         res.write('<div class="dropdown"><select name="filter" id="filter">');
         res.write('<button class="dropbtn">Dropdown</button>');
         res.write('<div class="dropdown-content" align="center"><a>Link1</a></div></div><br><br><br>');
         res.write('<form method="post"><input type="button" align="center" class="btn" onclick="hide_init()" value="Apply Filters"></form>');
         res.write('</select>');*/

         res.write('<html><head><script type="text/javascript"> function id_no_show(){ $("#id_no").show(); } function validate_reason(){ var reason=$("#reason").val(); if(reason !=""){ return true; } else{ $("#err_reason").show(); return false } }</script><style> ul { list-style-type: none; margin: 0; padding: 0; overflow: hidden; background-color: orangered; width:auto;}li { float: left; }li a, .dropbtn { display: inline-block; color: black; text-align: center; padding: 14px 16px; text-decoration: none; font-family: Trebuchet MS; } li a:hover, .dropdown:hover .dropbtn { background-color: red; }li.dropdown { display: inline-block; }.dropdown-content { display: none; position: absolute; background-color: #F9F9F9 ; min-width: 160px; box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2); z-index: 1; }.dropdown-content a { color: black; padding: 12px 16px; text-decoration: none; display: block; text-align: left;}.dropdown-content a:hover {background-color:grey;}.dropdown:hover .dropdown-content { display: block; } </style></head><body><ul><li><a href="/">Home</a></li><li><form action="chk_feedback" method="post"><button value="view_feedback">Check Feedback</button></form></li><li class="dropdown"></li><li><form action="final_filter" method="post"><select class="dropbtn"  name="uid" id="uid"><option selected="Select Type of Filter" disabled>Select Filter type</option><option value="Name">Name</option><option value="Reason" >Reason</option></select></li><li><input type="textbox" id="filter_cat" name="filter_cat" size="20" style="height:42px;, font-family:Trebuchet MS" placeholder="Search here"></li><li><button onclick="hide_init()">Apply filters</button></form></li><li><a href="/">Logout</a></li></ul>');



        var sql2 = "SELECT * FROM Registration";
        con2.query(sql2, function (err, result, fields) {
        if (err) throw err;
        //res.writeHead(200,{'Content-Type':'text/html'});
        res.write('<link rel="stylesheet" href="admin_table.css">');
        res.write('<table border="1" id="customers" name="customers">');
        res.write('<tr>');
        res.write('<th>'+'ID'+'</th>');
        res.write('<th>'+'NAME'+'</th>');
        res.write('<th>'+'CONTACT'+'</th>');
        res.write('<th>'+'EMAIL'+'</th>');
        res.write('<th>'+'ID TYPE'+'</th>');
        res.write('<th>'+'ID NUMBER'+'</th>');
        res.write('<th>'+'REASON'+'</th>');
        res.write('<th>'+'CONTACT PERSON'+'</th>');
        res.write('<th>'+'DATE'+'</th>');
        res.write('<th>'+'CHECK IN'+'</th>');
        res.write('<th>'+'CHECK OUT'+'</th>');
        res.write('</tr>');

        for(var i=0;i<result.length;i++)
        {
          res.write('<tr>');
          res.write('<td>'+result[i].Guest_ID+'</td>');
          res.write('<td>'+result[i].Username+'</td>');
          res.write('<td>'+result[i].Contact+'</td>');
          res.write('<td>'+result[i].Email+'</td>');
          res.write('<td>'+result[i].IDproof+'</td>');
          res.write('<td>'+result[i].ID_Number+'</td>');
          res.write('<td>'+result[i].Reason+'</td>');
          res.write('<td>'+result[i].Whom_to_meet+'</td>');
          res.write('<td>'+result[i].Date+'</td>');
          res.write('<td>'+result[i].CheckIn+'</td>');
          res.write('<td>'+result[i].CheckOut+'</td>');
          res.write('</tr>');
        }
        res.write('</table>');
  req.session.errors = null;

});
}
});
}
});
});

router.post('/final_filter', function(req, res, next) {
  console.log("filtering out");
  var by=req.body.uid;
  console.log(by);
  var txt=req.body.filter_cat;
  console.log(txt);
  var mysql = require('mysql');
  var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "pict123",
  database: "HR_PRODUCT"
        });

  if(by=="Name")
  {

     var sql="Select * from Registration where Username="+"'"+txt+"'";
     con.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.writeHead(200,{'Content-Type':'text/html'});
        res.write('<link rel="stylesheet" href="admin_table.css">');
        res.write('<table border="1" id="customers" name="customers">');
        res.write('<tr>');
        res.write('<th>'+'ID'+'</th>');
        res.write('<th>'+'NAME'+'</th>');
        res.write('<th>'+'CONTACT'+'</th>');
        res.write('<th>'+'EMAIL'+'</th>');
        res.write('<th>'+'ID TYPE'+'</th>');
        res.write('<th>'+'ID NUMBER'+'</th>');
        res.write('<th>'+'REASON'+'</th>');
        res.write('<th>'+'CONTACT PERSON'+'</th>');
        res.write('<th>'+'DATE'+'</th>');
        res.write('<th>'+'CHECK IN'+'</th>');
        res.write('<th>'+'CHECK OUT'+'</th>');
        res.write('</tr>');

        for(var i=0;i<result.length;i++)
        {
          res.write('<tr>');
          res.write('<td>'+result[i].Guest_ID+'</td>');
          res.write('<td>'+result[i].Username+'</td>');
          res.write('<td>'+result[i].Contact+'</td>');
          res.write('<td>'+result[i].Email+'</td>');
          res.write('<td>'+result[i].IDproof+'</td>');
          res.write('<td>'+result[i].ID_Number+'</td>');
          res.write('<td>'+result[i].Reason+'</td>');
          res.write('<td>'+result[i].Whom_to_meet+'</td>');
          res.write('<td>'+result[i].Date+'</td>');
          res.write('<td>'+result[i].CheckIn+'</td>');
          res.write('<td>'+result[i].CheckOut+'</td>');
          res.write('</tr>');
        }
        res.write('</table>');

  });
}
else if(by=="Reason")
  {

     var sql="Select * from Registration where Reason="+"'"+txt+"'";
     con.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.writeHead(200,{'Content-Type':'text/html'});
        res.write('<link rel="stylesheet" href="admin_table.css">');
        res.write('<table border="1" id="customers" name="customers">');
        res.write('<tr>');
        res.write('<th>'+'ID'+'</th>');
        res.write('<th>'+'NAME'+'</th>');
        res.write('<th>'+'CONTACT'+'</th>');
        res.write('<th>'+'EMAIL'+'</th>');
        res.write('<th>'+'ID TYPE'+'</th>');
        res.write('<th>'+'ID NUMBER'+'</th>');
        res.write('<th>'+'REASON'+'</th>');
        res.write('<th>'+'CONTACT PERSON'+'</th>');
        res.write('<th>'+'DATE'+'</th>');
        res.write('<th>'+'CHECK IN'+'</th>');
        res.write('<th>'+'CHECK OUT'+'</th>');
        res.write('</tr>');

        for(var i=0;i<result.length;i++)
        {
          res.write('<tr>');
          res.write('<td>'+result[i].Guest_ID+'</td>');
          res.write('<td>'+result[i].Username+'</td>');
          res.write('<td>'+result[i].Contact+'</td>');
          res.write('<td>'+result[i].Email+'</td>');
          res.write('<td>'+result[i].IDproof+'</td>');
          res.write('<td>'+result[i].ID_Number+'</td>');
          res.write('<td>'+result[i].Reason+'</td>');
          res.write('<td>'+result[i].Whom_to_meet+'</td>');
          res.write('<td>'+result[i].Date+'</td>');
          res.write('<td>'+result[i].CheckIn+'</td>');
          res.write('<td>'+result[i].CheckOut+'</td>');
          res.write('</tr>');
        }
        res.write('</table>');
      });
}
  req.session.errors = null;
});

router.get('/checkout', function(req, res, next) {
  res.render('checkout');
  req.session.errors = null;
});

router.get('/feedback', function(req, res, next) {
  res.render('feedback');
  req.session.errors = null;
});

router.post('/chk_feedback', function(req, res, next) {
  var mysql = require('mysql');
  var con2 = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pict123",
    database: "HR_PRODUCT"
   });

   var sql="select * from Feedback";
   con2.query(sql,function(err,result,fields){
      if(err) throw err;
      else{
        res.writeHead(200,{'Content-Type':'text/html'});
        res.write('<link rel="stylesheet" href="admin_table.css">');
         res.write('<h2 align="center" >Feedback Page</h1>');
        
        res.write('<table border="1" id="customers">');
        res.write('<tr>');
        res.write('<th>'+'Feedbacks'+'</th>');
                res.write('</tr>');

        for(var i=0;i<result.length;i++)
        {
          res.write('<tr>');
          res.write('<td>'+result[i].content+'</td>');
          res.write('</tr>');
        }
        res.write('</table>');

      }
   });
  
  //res.render('node_email');
  req.session.errors = null;
});

router.post('/final_feed', function(req, res, next) {
  var msg=req.body.message;
  if(msg!='')
  {
    var mysql = require('mysql');
    var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pict123",
    database: "HR_PRODUCT"
        });
    var sql="INSERT INTO Feedback Values("+"'"+msg+"'"+")";
    con.query(sql,function(err,result,fields)
    {
      if(err)
        throw err;
      else
      {
        console.log("Feedback Recorded");
      }

    });
  }
  res.render('index');
  req.session.errors = null;
});


router.post('/submit', function(req, res, next) {
 
  var a=req.body.username;
  var b=req.body.contact;
  var c=req.body.email;
  var d=req.body.uid;
  var e=req.body.id_no;
  var f=req.body.reason;
  var g=req.body.whom;

var mysql = require('mysql');
var con = mysql.createConnection({
host: "localhost",
user: "root",
password: "pict123",
database: "HR_PRODUCT"
});

con.connect(function(err) {
if (err) throw err;
console.log("Connected!");
var sql = "INSERT INTO Registration(Username,Contact,Email,IDproof,ID_Number,Reason,Whom_to_meet) VALUES ("+"'"+a+"'"+","+"'"+b+"'"+","+"'"+c+"'"+","+"'"+d+"'"+","+"'"+e+"'"+","+"'"+f+"'"+","+"'"+g+"'"+")";
con.query(sql, function (err, result) {
if (err) throw err;
console.log("1 record inserted");
});

});

  var errors = req.validationErrors();
  if (errors) {
    req.session.errors = errors;
    req.session.success = false;
  } else {
    req.session.success = true;
  }
  res.redirect('/');
});
module.exports = router;
