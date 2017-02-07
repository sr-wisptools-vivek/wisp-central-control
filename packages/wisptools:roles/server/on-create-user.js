Accounts.onCreateUser(function(options, user) {

  // Assign Role
  if(Meteor.users.find().count() < 1) {
    user.roles = ['admin'];
    Roles.addUsersToRoles(user._id,['admin']);
  } else {
    user.roles = ['customer'];
    Roles.addUsersToRoles(user._id,['customer']);
  }

  // Send new user sign up email
  var emailValues = {
    to: Meteor.settings.signUpNotifyEmail,
    from: Meteor.settings.email.from,
    subject: 'New RN Control Sign Up'
  };
  var userEmail = 'N/A';
  if (user.emails && user.emails[0]) {
    userEmail = user.emails[0].address;
  }
  var userDomain = 'N/A';
  if (options.profile && options.profile.domain) {
    userDomain = options.profile.domain;
  }
  emailValues.text = 'User Email: ' + userEmail + "\n";
  emailValues.text += 'User Domain: ' + userDomain + "\n";
  Email.send(emailValues);

  // We still want the default hook's 'profile' behavior.
  if (options.profile)
    user.profile = options.profile;

  return user;
});