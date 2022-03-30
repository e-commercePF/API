var nodemailer = require ('nodemailer')

var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,//465 for gmail
    secure: true, // true for 465, false for other ports
    auth: {
      user: "sportsmarketnl@gmail.com", 
      pass: "ikxjkliszgxycihj", 
    },
    tls:{
      rejectUnauthorized: false
    }
  });

transporter.verify().then(() => {
    console.log('ready to send emails')
})

module.exports = {
    transporter
}