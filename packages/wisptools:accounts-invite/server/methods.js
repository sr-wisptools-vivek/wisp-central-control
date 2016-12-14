Meteor.methods({
  'wtAccountsInviteInviteUser': function (email) {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized"); // Check user logged in.
    if (!Roles.userIsInRole(this.userId, ['domain-admin'])) throw new Meteor.Error(401, "Not authorized"); // Only domain-admin can invite users

    var user = Meteor.users.findOne({'emails.address': email});
    if (user) {
      throw new Meteor.Error("accounts-invite", "An account already exist with this email.");
    }

    var domain = "";
    if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.domain) {
      domain = Meteor.user().profile.domain;
    }

    var invitation = WtAccountsInviteTokens.findOne({email: email, domain: domain});
    if (invitation) {
      throw new Meteor.Error("accounts-invite", "An invitation has already been send to this email id.");
    }

    var token = Random.secret();
    if (!token || !domain) {
      throw new Meteor.Error("accounts-invite", "An unknown error has occurred.");
    }
    WtAccountsInviteTokens.insert({
      email: email,
      token: token,
      domain: domain,
      accepted: false,
      owner: this.userId
    });

    WtAccountsInvite.sendInvitationMail(email, token, domain);
  },

  'wtAccountsInviteGetInvite': function (token) {
    var invite = WtAccountsInviteTokens.findOne({
      token: token,
      accepted: false
    });
    if (invite) {
      return invite;
    }
    throw new Meteor.Error("accounts-invite", "Invalid token.");
  }
});
