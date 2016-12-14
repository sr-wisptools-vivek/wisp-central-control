Template.wtAccountsInviteCreateAccount.onRendered(function () {
  Session.set('wtAccountsInviteChecking', true);
  Meteor.call('wtAccountsInviteGetInvite', this.data.token, function (err, res) {
    if (err) {
      Session.set('wtAccountsInviteDetails', false);
      Session.set('wtAccountsInviteChecking', false);
    } else {
      Session.set('wtAccountsInviteDetails', res);
      Session.set('wtAccountsInviteChecking', false);
    }
  });
});

Template.wtAccountsInviteCreateAccount.helpers({
  'checking': function () {
    return Session.get('wtAccountsInviteChecking');
  },
  'isValidToken': function () {
    var invite = Session.get('wtAccountsInviteDetails');
    if (invite) {
      return true;
    }
    return false;
  }
});

Template.wtAccountsInviteCreateAccountForm.helpers({
  'invite': function () {
    return Session.get('wtAccountsInviteDetails');
  }
});
