'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  nodemailer = require('nodemailer'),
  async = require('async'),
  crypto = require('crypto');
  var Mailgun = require('mailgun-js');

var smtpTransport = nodemailer.createTransport(config.mailer.options);

/**
 * Forgot for reset password (forgot POST)
 */

// function sendEmailToClient(){
//   var api_key_value = 'key-032b2ddfd753c2ee4bd07bc46dff58e1';
//   var domain_name = 'mg.my-promethean.com';

//   var initMailgun = { apiKey : api_key_value , domain :  domain_name } ;
//   var mailgun = new Mailgun( initMailgun );

  
//  // var fp = path.join(__dirname, 'page3.pdf');
//   var fp = 'Charts/Energy_Report.pdf';
  
//   var data = {
//     from: 'support@my-promethean.com',
//     to: 'dk.peace@prometheanenergy.com',    
//     subject: 'Promethean Honda Report',
//     attachment:fp ,
//     html: 'Hello, This is not a plain-text email, I wanted to test some spicy Mailgun sauce in NodeJS! <a href="http://0.0.0.0:3030/validate?>Click here to add your email address to a mailing list</a>'
//   }

//   mailgun.messages().send(data, function (err, body) {
//       if (err) {
//           console.log("got an error: ", err);
//       }
//       else {
//           console.log("MAil Sent........"+JSON.stringify(body));
//          // console.log(body);
//       }
//   });
  
// }





exports.forgot = function (req, res, next) {
  async.waterfall([
    // Generate random token
    function (done) {
      crypto.randomBytes(20, function (err, buffer) {
        var token = buffer.toString('hex');
        done(err, token);
      });
    },
    // Lookup user by username
    function (token, done) {
      if (req.body.username) {
        User.findOne({
          username: req.body.username.toLowerCase()
        }, '-salt -password', function (err, user) {
          if (!user) {
            return res.status(400).send({
              message: 'No account with that username has been found'
            });
          } else if (user.provider !== 'local') {
            return res.status(400).send({
              message: 'It seems like you signed up using your ' + user.provider + ' account'
            });
          } else {
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            user.save(function (err) {
              done(err, token, user);
            });
          }
        });
      } else {
        return res.status(400).send({
          message: 'Username field must not be blank'
        });
      }
    },
    function (token, user, done) {

      var httpTransport = 'http://';
      if (config.secure && config.secure.ssl === true) {
        httpTransport = 'https://';
      }
      res.render(path.resolve('modules/users/server/templates/reset-password-email'), {
        name: user.displayName,
        appName: config.app.title,
        url: httpTransport + req.headers.host + '/api/auth/reset/' + token
      }, function (err, emailHTML) {
        done(err, emailHTML, user);
      });
    },
    // If valid email, send reset email using service
    function (emailHTML, user, done) {

      console.log("Inside send emaillllllllllllllll");

      var api_key_value = 'key-032b2ddfd753c2ee4bd07bc46dff58e1';
         var domain_name = 'mg.my-promethean.com';
      

      // var api_key_value = '4ce2288bdb3c24d8bfb78e979bf859fc-bd350f28-3adee12c';
      // var domain_name = 'sandbox2190294574594dbf9ccaff4d93f9c746.mailgun.org';
    
      var initMailgun = { apiKey : api_key_value , domain :  domain_name } ;
      var mailgun = new Mailgun( initMailgun );
    
      
     // var fp = path.join(__dirname, 'page3.pdf');
     // var fp = 'Charts/Energy_Report.pdf';
      
      var data = {
        from: 'dk.peace@gmail.com',
        to: 'prakashkumarin@gmail.com',    
        subject: 'Password reset test',        
        html: 'Hello, This is not a plain-text email, I wanted to test some spicy Mailgun sauce in NodeJS! <a href="http://0.0.0.0:3030/validate?>Click here to add your email address to a mailing list</a>'
      }
    
      mailgun.messages().send(data, function (err, body) {
          if (err) {
              console.log("got an error: ", err);
          }
          else {
              console.log("MAil Sent........"+JSON.stringify(body));
             // console.log(body);
          }
          done(err);
      });
     

      // var mailOptions = {
      //   to: user.email,
      //   from: config.mailer.from,
      //   subject: 'Password Reset',
      //   html: emailHTML
      // };
      // console.log("mailOptions :"+JSON.stringify(mailOptions));
      // smtpTransport.sendMail(mailOptions, function (err) {
      //   if (!err) {
      //     res.send({
      //       message: 'An email has been sent to the provided email with further instructions.'
      //     });
      //   } else {
      //     return res.status(400).send({
      //       message: 'Failure sending email :'+err
      //     });
      //   }

      //   done(err);
      // });
    }
  ], function (err,sucess) {
    if (err) {
      console.log("Error :"+err);
      return next(err);
    }
  });
};

/**
 * Reset password GET from email token
 */
exports.validateResetToken = function (req, res) {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function (err, user) {
    if (!user) {
      return res.redirect('/password/reset/invalid');
    }

    res.redirect('/password/reset/' + req.params.token);
  });
};

/**
 * Reset password POST from email token
 */
exports.reset = function (req, res, next) {
  // Init Variables
  var passwordDetails = req.body;
  var message = null;

  async.waterfall([

    function (done) {
      User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      }, function (err, user) {
        if (!err && user) {
          if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
            user.password = passwordDetails.newPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function (err) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                req.login(user, function (err) {
                  if (err) {
                    res.status(400).send(err);
                  } else {
                    // Remove sensitive data before return authenticated user
                    user.password = undefined;
                    user.salt = undefined;

                    res.json(user);

                    done(err, user);
                  }
                });
              }
            });
          } else {
            return res.status(400).send({
              message: 'Passwords do not match'
            });
          }
        } else {
          return res.status(400).send({
            message: 'Password reset token is invalid or has expired.'
          });
        }
      });
    },
    function (user, done) {
      res.render('modules/users/server/templates/reset-password-confirm-email', {
        name: user.displayName,
        appName: config.app.title
      }, function (err, emailHTML) {
        done(err, emailHTML, user);
      });
    },
    // If valid email, send reset email using service
    function (emailHTML, user, done) {
      var mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Your password has been changed',
        html: emailHTML
      };

      smtpTransport.sendMail(mailOptions, function (err) {
        done(err, 'done');
      });
    }
  ], function (err) {
    if (err) {
      return next(err);
    }
  });
};

/**
 * Change Password
 */
exports.changePassword = function (req, res, next) {
  // Init Variables
  var passwordDetails = req.body;
  var message = null;

  if (req.user) {
    if (passwordDetails.newPassword) {
      User.findById(req.user.id, function (err, user) {
        if (!err && user) {
          if (user.authenticate(passwordDetails.currentPassword)) {
            if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
              user.password = passwordDetails.newPassword;

              user.save(function (err) {
                if (err) {
                  return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                } else {
                  req.login(user, function (err) {
                    if (err) {
                      res.status(400).send(err);
                    } else {
                      res.send({
                        message: 'Password changed successfully'
                      });
                    }
                  });
                }
              });
            } else {
              res.status(400).send({
                message: 'Passwords do not match'
              });
            }
          } else {
            res.status(400).send({
              message: 'Current password is incorrect'
            });
          }
        } else {
          res.status(400).send({
            message: 'User is not found'
          });
        }
      });
    } else {
      res.status(400).send({
        message: 'Please provide a new password'
      });
    }
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};
