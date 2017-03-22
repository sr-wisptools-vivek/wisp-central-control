// Write your package code here!
WtAES = {};

WtAES.encrypt = function (msg) {
  var encrypt = CryptoJS.AES.encrypt(msg, Meteor.settings.aes.passphrase);
  return encrypt.toString();
}

// decrypt is only avialible on the server
WtAES.decrypt = function (msg) {
  var decrypted = CryptoJS.AES.decrypt(msg, Meteor.settings.aes.passphrase);
  return decrypted.toString(CryptoJS.enc.Utf8);
}

Meteor.methods({
  'wtEncrypt': function (msg) {
    return WtAES.encrypt(msg);
  }
});
