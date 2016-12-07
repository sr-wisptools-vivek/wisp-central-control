Meteor.startup(function () {
  process.env.MAIL_URL = Meteor.settings.email.mailURL || '';
  Accounts.emailTemplates.from = Meteor.settings.email.from || '';
});
