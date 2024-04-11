'use strict';

var Firebase = require("firebase"),
  FirebaseTokenGenerator = require("firebase-token-generator"),
  Q = require("q");

// Authenticate the server to Firebase
module.exports = function(options) {
  if (!options.secretKey || !options.rootRef || !options.UID) {
    throw new Error("options cannot be null");
  }
  var deferred = Q.defer();
  var rootRef = new Firebase(options.rootRef);
  var tokenGenerator = new FirebaseTokenGenerator(options.secretKey);
  var token = tokenGenerator.createToken({
    uid: options.UID
  }, {
    admin: options.admin
  });
  rootRef.authWithCustomToken(token, function(error) {
    if (error) {
      deferred.reject(error);
      throw error;
    } else {
      deferred.resolve(rootRef);
    }
  });
  return deferred.promise;
};
