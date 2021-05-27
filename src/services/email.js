
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'timtalkbox@gmail.com',
      pass: 'Rajat@123'
    },
    tls: {
      rejectUnauthorized: false
    }
});

exports.sendVerificationEmail= (options) => {

    return new Promise((resolve, reject) => {
        let mailOptions = {
            from:  'timtalkbox@gmail.com' ,
            to: options.to,
            subject: options.subject,
            text: options.text
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error)
                reject(error)
            } else {
                console.log(info.response)
                resolve(info.response)
            }
          });
    })
        
    
}
