'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Addproduct = mongoose.model('Addproduct'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  addproduct;

/**
 * Addproduct routes tests
 */
describe('Addproduct CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Addproduct
    user.save(function () {
      addproduct = {
        name: 'Addproduct name'
      };

      done();
    });
  });

  it('should be able to save a Addproduct if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Addproduct
        agent.post('/api/addproducts')
          .send(addproduct)
          .expect(200)
          .end(function (addproductSaveErr, addproductSaveRes) {
            // Handle Addproduct save error
            if (addproductSaveErr) {
              return done(addproductSaveErr);
            }

            // Get a list of Addproducts
            agent.get('/api/addproducts')
              .end(function (addproductsGetErr, addproductsGetRes) {
                // Handle Addproducts save error
                if (addproductsGetErr) {
                  return done(addproductsGetErr);
                }

                // Get Addproducts list
                var addproducts = addproductsGetRes.body;

                // Set assertions
                (addproducts[0].user._id).should.equal(userId);
                (addproducts[0].name).should.match('Addproduct name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Addproduct if not logged in', function (done) {
    agent.post('/api/addproducts')
      .send(addproduct)
      .expect(403)
      .end(function (addproductSaveErr, addproductSaveRes) {
        // Call the assertion callback
        done(addproductSaveErr);
      });
  });

  it('should not be able to save an Addproduct if no name is provided', function (done) {
    // Invalidate name field
    addproduct.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Addproduct
        agent.post('/api/addproducts')
          .send(addproduct)
          .expect(400)
          .end(function (addproductSaveErr, addproductSaveRes) {
            // Set message assertion
            (addproductSaveRes.body.message).should.match('Please fill Addproduct name');

            // Handle Addproduct save error
            done(addproductSaveErr);
          });
      });
  });

  it('should be able to update an Addproduct if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Addproduct
        agent.post('/api/addproducts')
          .send(addproduct)
          .expect(200)
          .end(function (addproductSaveErr, addproductSaveRes) {
            // Handle Addproduct save error
            if (addproductSaveErr) {
              return done(addproductSaveErr);
            }

            // Update Addproduct name
            addproduct.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Addproduct
            agent.put('/api/addproducts/' + addproductSaveRes.body._id)
              .send(addproduct)
              .expect(200)
              .end(function (addproductUpdateErr, addproductUpdateRes) {
                // Handle Addproduct update error
                if (addproductUpdateErr) {
                  return done(addproductUpdateErr);
                }

                // Set assertions
                (addproductUpdateRes.body._id).should.equal(addproductSaveRes.body._id);
                (addproductUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Addproducts if not signed in', function (done) {
    // Create new Addproduct model instance
    var addproductObj = new Addproduct(addproduct);

    // Save the addproduct
    addproductObj.save(function () {
      // Request Addproducts
      request(app).get('/api/addproducts')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Addproduct if not signed in', function (done) {
    // Create new Addproduct model instance
    var addproductObj = new Addproduct(addproduct);

    // Save the Addproduct
    addproductObj.save(function () {
      request(app).get('/api/addproducts/' + addproductObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', addproduct.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Addproduct with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/addproducts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Addproduct is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Addproduct which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Addproduct
    request(app).get('/api/addproducts/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Addproduct with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Addproduct if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Addproduct
        agent.post('/api/addproducts')
          .send(addproduct)
          .expect(200)
          .end(function (addproductSaveErr, addproductSaveRes) {
            // Handle Addproduct save error
            if (addproductSaveErr) {
              return done(addproductSaveErr);
            }

            // Delete an existing Addproduct
            agent.delete('/api/addproducts/' + addproductSaveRes.body._id)
              .send(addproduct)
              .expect(200)
              .end(function (addproductDeleteErr, addproductDeleteRes) {
                // Handle addproduct error error
                if (addproductDeleteErr) {
                  return done(addproductDeleteErr);
                }

                // Set assertions
                (addproductDeleteRes.body._id).should.equal(addproductSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Addproduct if not signed in', function (done) {
    // Set Addproduct user
    addproduct.user = user;

    // Create new Addproduct model instance
    var addproductObj = new Addproduct(addproduct);

    // Save the Addproduct
    addproductObj.save(function () {
      // Try deleting Addproduct
      request(app).delete('/api/addproducts/' + addproductObj._id)
        .expect(403)
        .end(function (addproductDeleteErr, addproductDeleteRes) {
          // Set message assertion
          (addproductDeleteRes.body.message).should.match('User is not authorized');

          // Handle Addproduct error error
          done(addproductDeleteErr);
        });

    });
  });

  it('should be able to get a single Addproduct that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Addproduct
          agent.post('/api/addproducts')
            .send(addproduct)
            .expect(200)
            .end(function (addproductSaveErr, addproductSaveRes) {
              // Handle Addproduct save error
              if (addproductSaveErr) {
                return done(addproductSaveErr);
              }

              // Set assertions on new Addproduct
              (addproductSaveRes.body.name).should.equal(addproduct.name);
              should.exist(addproductSaveRes.body.user);
              should.equal(addproductSaveRes.body.user._id, orphanId);

              // force the Addproduct to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Addproduct
                    agent.get('/api/addproducts/' + addproductSaveRes.body._id)
                      .expect(200)
                      .end(function (addproductInfoErr, addproductInfoRes) {
                        // Handle Addproduct error
                        if (addproductInfoErr) {
                          return done(addproductInfoErr);
                        }

                        // Set assertions
                        (addproductInfoRes.body._id).should.equal(addproductSaveRes.body._id);
                        (addproductInfoRes.body.name).should.equal(addproduct.name);
                        should.equal(addproductInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Addproduct.remove().exec(done);
    });
  });
});
