var firebase = require('firebase-admin');
var serviceAccount = JSON.parse(process.env.fb_key);

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: process.env.fb_url
});

module.exports = firebase;
