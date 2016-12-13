Template.wtAccountsInviteInvite.helpers({
  'domainName': function () {
    return Meteor.user().profile.domain;
  }
});

Template.wtAccountsInviteInvite.events({
  'click .sendInvitationBtn': function (e) {
    e.preventDefault();
    var email = $('#inviteEmail').val();
    if (email.length > 0) {
      if (Accounts._loginButtons.validateEmail(email)) {
        Meteor.call('wtAccountsInviteInviteUser', email, function (err, res) {
          if (err) {
            WtGrowl.fail(err.reason);
          } else {
            WtGrowl.success('Invitation has been send.');
          }
        });
      } else {
        WtGrowl.fail('Please enter a valid email.');
      }
    }
  }
});
