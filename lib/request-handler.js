var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

// var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Links.reset().fetch().then(function(links) {
    res.send(200, links.models);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;
  console.log('URI---->', uri);
  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.find({url: uri}, function(err, found) {

    if (err) {
      console.log('FOUND---->', found);
      res.send(200, found);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }
        var newLink = Link({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        });
        console.log('NEW LINK: ', newLink);
        newLink.save(function(err) {
          // console.log('WHAT IS THIS VALUE? ', err);
          // Links.add(newLink);
          res.send(200, newLink);
        });
      });
    } 
  });

  // new Link({ url: uri }).fetch().then(function(found) {
  //   if (found) {
  //     res.send(200, found.attributes);
  //   } else {
  //     util.getUrlTitle(uri, function(err, title) {
  //       if (err) {
  //         console.log('Error reading URL heading: ', err);
  //         return res.send(404);
  //       }
  //       var newLink = new Link({
  //         url: uri,
  //         title: title,
  //         baseUrl: req.headers.origin
  //       });
  //       newLink.save().then(function(newLink) {
  //         Links.add(newLink);
  //         res.send(200, newLink);
  //       });
  //     });
  //   }
  // });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.find({ username: username }, function(err, found) {
    if (err) {
      res.redirect(302, '/login');
    } else {
      found.comparePassword(password, function(match) {
        if (match) {
          util.createSession(req, res, found);
        } else {
          res.redirect(302, '/login');
        }
      });
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username}).exec(function(err, found) {
    console.log('DID YOU FIND THE UERS?: ', found);
    if (!found) {
      var newUser = new User({
        username: username,
        password: password
      });
      newUser.save(function(err) {
        util.createSession(req, res, newUser);
      });
    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  });
};

exports.navToLink = function(req, res) {

  Link.findOne({code: req.params[0]}).exec(function(err, found) {
    if (!found) {
      res.redirect('/');
    } else {
      found.visits = found.visits + 1;
      found.save(function() {
        return res.redirect(found.url);
      });
    }
  });



  // new Link({ code: req.params[0] }).fetch().then(function(link) {
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     link.set({ visits: link.get('visits') + 1 })
  //       .save()
  //       .then(function() {
  //         return res.redirect(link.get('url'));
  //       });
  //   }
  // });
};