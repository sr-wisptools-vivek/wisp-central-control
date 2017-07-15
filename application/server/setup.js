Accounts.validateLoginAttempt(function (attemptInfo) {
  if (attemptInfo && attemptInfo.allowed && attemptInfo.user && attemptInfo.user.profile && attemptInfo.user.profile.disabled===true) {
    throw new Meteor.Error(403, "Your account has been disabled. Please contact your domain admin.");
  }
  return true;
});
