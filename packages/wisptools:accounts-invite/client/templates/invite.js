Template.wtAccountsInviteInvite.onCreated(function () {
  this.domain = new ReactiveVar('---');

});

Template.wtAccountsInviteInvite.onRendered(function () {
  var _this = this;
  Meteor.call('wtManagedRouterMySQLGetMyDomain', function (err, res) {
    if (!err) _this.domain.set(res);
  });
});

Template.wtAccountsInviteInvite.helpers({
  'domainName': function () {
    return Template.instance().domain.get();
  },
  'hasSendInvitations': function () {
    var invitations = WtAccountsInviteTokens.find({owner: Meteor.userId()}).count();
    if (invitations) {
      return true;
    }
    return false;
  },
  'getSendInvitations': function () {
    return WtAccountsInviteTokens.find({owner: Meteor.userId()});
  },
  'statusMessage': function (accepted) {
    return accepted?"Accepted":"Pending";
  },
  'showResendBtn': function (accepted) {
    return !accepted;
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
  },

  'click .resendInvitation': function (e) {
    e.preventDefault();
    Meteor.call('wtAccountsInviteResendInvitationMail', this._id, function (err, res) {
      if (err) {
        WtGrowl.fail('An error has occurred.');
      } else {
        WtGrowl.success('Invitation mail send.');
      }
    });
  }
});
