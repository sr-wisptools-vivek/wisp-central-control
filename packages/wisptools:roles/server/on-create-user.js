Accounts.onCreateUser(function(options, user) {

  // Assign Role
  if(Meteor.users.find().count() < 1) {
    user.roles = ['admin'];
    Roles.addUsersToRoles(user._id,['admin']);
  } else {
    user.roles = ['customer'];
    Roles.addUsersToRoles(user._id,['customer']);
  }

  // We still want the default hook's 'profile' behavior.
  if (options.profile)
    user.profile = options.profile;

  return user;
});