Meteor.methods({
  freeRouterNotifyEmail: function () {
    var user = Meteor.user();
    // Send new user sign up email
    var emailValues = {
      to: Meteor.settings.freeRouterNotifyEmail,
      from: Meteor.settings.email.from,
      subject: 'New RN Control Free Router Submission'
    };
    var userEmail = 'N/A';
    if (user.emails && user.emails[0]) {
      userEmail = user.emails[0].address;
    }
    emailValues.text = 'User Email: ' + userEmail + "\n";
    Email.send(emailValues);
  }
});
