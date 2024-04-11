firebase-auth
==========
Simple wrapper around firebase token authentication


## Installation
  ```
  npm install firebase-auth --save
  ```

## Usage
  ```
  var firebaseAuth = require("firebase-auth");
  var options = {
    rootRef: "rootRef",
    secretKey: process.env.FIREBASE_SECRET_KEY,
    UID: 'uid',
    admin: true || false //true or false
  }
  
  firebaseAuth(options).then(function(rootRef){
    //authenticated rootRef
  }, function(error) {
    //handle error as you please
    throw error
  })
  ```


## Contributing

Fork and submit pull requests to improve this repo

## Issues

Yes, there would be bugs or feature requests.

Please open an issue and I would try to reply as soon as possible

## Release History

* 0.1.0 Initial release
