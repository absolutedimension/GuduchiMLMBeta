'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  passport = require('passport'),
  User = mongoose.model('User');

// URLs for which user can't be redirected on signin
var noReturnUrls = [
  '/authentication/signin',
  '/authentication/signup'
];

/**
 * Signup
 */
exports.signup = function (req, res) {
  console.log("user obj :"+JSON.stringify(req.body));
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  // Init Variables
  var user = new User(req.body);
  var message = null;

  // Add missing user fields
  user.provider = 'local';
  user.displayName = user.firstName + ' ' + user.lastName;
  // user.roles = 'user';

  // Then save the user
  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(user);
        }
      });
    }
  });
};

exports.registerNewUser = function(req,res){
  var userObj = req.body;
  var user = new User(userObj);
  user.provider = 'local';
  user.displayName = user.firstName + ' ' + user.lastName;
  user.roles = 'user';
  user.save(function(err){
    if(err){
      return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
      });
    } else {
      User.update({username:userObj.sponsor_id},{$addToSet:{childs:user._id}}).exec(function(err,response){
          if(err){
              return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
          });
          } else {
              return res.status(200).send(response);
          }
      });
    }
  });
};

exports.getChildForParents = function(req,res){
  var usernameToSearch = req.body.username;//JSON.stringify(req.body);
  console.log("username :"+usernameToSearch);
  User.findOne({username:usernameToSearch}).exec(function(err,response){
      if(err){
         return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        console.log("response :"+JSON.stringify(response));
        User.find({_id:{$in:response.childs}}).exec(function(err,response1){
          if(err){
            return res.status(400).send({
             message: errorHandler.getErrorMessage(err)
           });
         } else {
           res.status(200).send(response1);
         }
        });
      }
  });
}

exports.validateSponsorId = function(req,res){
  var sponsorId = req.params.sponsorId;
  console.log("sponsorId :"+sponsorId);
  User.findOne({username:sponsorId},{displayName:1,childs:1}).exec(function(err,response){
    if(err){
      return res.status(400).send({
       message: errorHandler.getErrorMessage(err)
     });
   } else {
     if(response !=null){
    if(response.childs.length > 0 ) {
      console.log("response"+response.childs[0]);
      User.findOne({_id:response.childs[0]},{side:1}).exec(function(err,response1){
       if(err){
         return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var finalResonse = {
           "displayName" :response.displayName,
           "side":response1.side,
           "childDisplayName":response1.displayName
        }
       res.status(200).send(finalResonse);
      }
      });
       
    } else {
      var finalResonse = {
        "displayName" :response.displayName,
        "side":"LR",
        "childDisplayName":"No Child"
     }
    res.status(200).send(finalResonse);
    }   
  }else{
    var finalResonse = {
      "displayName" :"Sponser is not found.",
      "side":"NA",
      "childDisplayName":"No Child"
   }
   res.status(200).send(finalResonse);
  }   
   }
  });
}



    /**
     * Signin after passport authentication
     */
    exports.signin = function (req, res, next) {
      passport.authenticate('local', function (err, user, info) {
        if (err || !user) {
          res.status(400).send(info);
        } else {
          // Remove sensitive data before login
          user.password = undefined;
          user.salt = undefined;

          req.login(user, function (err) {
            if (err) {
              res.status(400).send(err);
            } else {
              res.json(user);
            }
          });
        }
      })(req, res, next);
    };

    /**
     * Signout
     */
    exports.signout = function (req, res) {
      req.logout();
      res.redirect('/');
    };

    /**
     * OAuth provider call
     */
    exports.oauthCall = function (strategy, scope) {
      return function (req, res, next) {
        // Set redirection path on session.
        // Do not redirect to a signin or signup page
        if (noReturnUrls.indexOf(req.query.redirect_to) === -1) {
          req.session.redirect_to = req.query.redirect_to;
        }
        // Authenticate
        passport.authenticate(strategy, scope)(req, res, next);
      };
    };

    /**
     * OAuth callback
     */
    exports.oauthCallback = function (strategy) {
      return function (req, res, next) {
        // Pop redirect URL from session
        var sessionRedirectURL = req.session.redirect_to;
        delete req.session.redirect_to;

        passport.authenticate(strategy, function (err, user, redirectURL) {
          if (err) {
            return res.redirect('/authentication/signin?err=' + encodeURIComponent(errorHandler.getErrorMessage(err)));
          }
          if (!user) {
            return res.redirect('/authentication/signin');
          }
          req.login(user, function (err) {
            if (err) {
              return res.redirect('/authentication/signin');
            }

            return res.redirect(redirectURL || sessionRedirectURL || '/');
          });
        })(req, res, next);
      };
    };

    /**
     * Helper function to save or update a OAuth user profile
     */
    exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
      if (!req.user) {
        // Define a search query fields
        var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
        var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

        // Define main provider search query
        var mainProviderSearchQuery = {};
        mainProviderSearchQuery.provider = providerUserProfile.provider;
        mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

        // Define additional provider search query
        var additionalProviderSearchQuery = {};
        additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

        // Define a search query to find existing user with current provider profile
        var searchQuery = {
          $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
        };

        User.findOne(searchQuery, function (err, user) {
          if (err) {
            return done(err);
          } else {
            if (!user) {
              var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

              User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
                user = new User({
                  firstName: providerUserProfile.firstName,
                  lastName: providerUserProfile.lastName,
                  username: availableUsername,
                  displayName: providerUserProfile.displayName,
                  email: providerUserProfile.email,
                  profileImageURL: providerUserProfile.profileImageURL,
                  provider: providerUserProfile.provider,
                  providerData: providerUserProfile.providerData
                });

                // And save the user
                user.save(function (err) {
                  return done(err, user);
                });
              });
            } else {
              return done(err, user);
            }
          }
        });
      } else {
        // User is already logged in, join the provider data to the existing user
        var user = req.user;

        // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
        if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
          // Add the provider data to the additional provider data field
          if (!user.additionalProvidersData) {
            user.additionalProvidersData = {};
          }

          user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

          // Then tell mongoose that we've updated the additionalProvidersData field
          user.markModified('additionalProvidersData');

          // And save the user
          user.save(function (err) {
            return done(err, user, '/settings/accounts');
          });
        } else {
          return done(new Error('User is already connected using this provider'), user);
        }
      }
    };

    /**
     * Remove OAuth provider
     */
    exports.removeOAuthProvider = function (req, res, next) {
      var user = req.user;
      var provider = req.query.provider;

      if (!user) {
        return res.status(401).json({
          message: 'User is not authenticated'
        });
      } else if (!provider) {
        return res.status(400).send();
      }

      // Delete the additional provider
      if (user.additionalProvidersData[provider]) {
        delete user.additionalProvidersData[provider];

        // Then tell mongoose that we've updated the additionalProvidersData field
        user.markModified('additionalProvidersData');
      }

      user.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.login(user, function (err) {
            if (err) {
              return res.status(400).send(err);
            } else {
              return res.json(user);
            }
          });
        }
      });
    };