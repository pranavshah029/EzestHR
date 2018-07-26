function send_email(){
var nodemailer = require('nodemailer');

var recipient = document.getElementById("email");



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
subject: 'Sending Email using Node.js',
text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
if (error) {
console.log(error);
} else {
console.log('Email sent: ' + info.response);
}
});
}
