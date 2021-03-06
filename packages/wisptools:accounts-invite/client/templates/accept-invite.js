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
  'isLoggedIn': function () {
    if (Meteor.userId()) {
      return true;
    }
    return false;
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

Template.wtAccountsInviteCreateAccountForm.events({
  'click .createAccountBtn': function (e) {
    e.preventDefault();
    var password = $('#password').val();
    var token = Template.parentData().token;
    if (password.length > 5) {
      if (password == $('#cpassword').val()) {
        Meteor.call('wtAccountsInviteCreateAccount', token, password, function (err, res) {
          if (err) {
            WtGrowl.fail(err.reason);
          } else {
            WtGrowl.success('Account created.');
            console.log(res);

            Meteor.loginWithPassword(res.email, password, function (err) {
              if (err) {
                WtGrowl.fail('Unable to login the user.');
              } else {
                Meteor.call('wtAccountsInviteAccepted', token, function (err) {
                  if (err) {
                    WtGrowl.fail('Failed to update token status.');
                  }
                });
                Router.go('home');
              }
            });
          }
        });
      } else {
        WtGrowl.fail('Passwords does not match.');
      }
    } else {
      WtGrowl.fail('Password must be atleast six characters long.');
    }
  }
});
