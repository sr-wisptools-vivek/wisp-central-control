WtNodemailer = {};

if (Meteor.isServer) {

  var nodemailer = Npm.require('nodemailer');
  
  WtNodemailer = nodemailer.createTransport({
    host  : Meteor.settings.wisptools.smtpHost,
    port  : Meteor.settings.wisptools.smtpPort,
    auth  : {
      user  : Meteor.settings.wisptools.smtpUser,
      pass  : Meteor.settings.wisptools.smtpPass
    },
    tls: {
      rejectUnauthorized  : false
    }
  });


}
