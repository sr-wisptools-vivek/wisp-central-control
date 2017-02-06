Accounts.onCreateUser(function(options, user) {

  // Assign Role
  if(Meteor.users.find().count() < 1) {
    user.roles = ['admin'];
    Roles.addUsersToRoles(user._id,['admin']);
  } else {
    user.roles = ['customer'];
    Roles.addUsersToRoles(user._id,['customer']);
  }

  var options = {
    to: Meteor.settings.signUpNotifyEmail,
    from: Meteor.settings.email.from,
    subject: 'New RN Control Sign Up'
  };

  var email = 'N/A';
  if (user.emails && user.emails[0]) {
    email = user.emails[0].address;
  }

  options.text = 'User: ' + email;

  Email.send(options);  

  // We still want the default hook's 'profile' behavior.
  if (options.profile)
    user.profile = options.profile;

  return user;
});