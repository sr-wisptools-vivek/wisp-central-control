Meteor.methods({
  'wtAccountsInviteInviteUser': function (email) {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized"); // Check user logged in.
    if (!Roles.userIsInRole(this.userId, ['domain-admin'])) throw new Meteor.Error(401, "Not authorized"); // Only domain-admin can invite users

    var user = Meteor.users.findOne({'emails.address': email});
    if (user) {
      throw new Meteor.Error("accounts-invite", "An account already exist with this email.");
    }

    var domain = Meteor.call('wtManagedRouterMySQLGetMyDomain');

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
  },

  'wtAccountsInviteCreateAccount': function (token, password) {
    var invite = WtAccountsInviteTokens.findOne({
      token: token,
      accepted: false
    });
    if (!invite) {
      throw new Meteor.Error("accounts-invite", "Invalid token.");
    }

    var options = {
      email: invite.email,
      password: password,
      profile: {
        domain: invite.domain
      }
    };

    var newUserId = Accounts.createUser(options);
    if (!newUserId) {
      throw new Meteor.Error("accounts-invite", "Unable to create account.");
    } else {
      WtMangedRouterMySQLDomains.insert({userId: newUserId, name: invite.domain});
      return {
        userId: newUserId,
        email: invite.email
      };
    }
  },

  'wtAccountsInviteAccepted': function (token) {
    WtAccountsInviteTokens.update({token: token}, {$set:{accepted: true}});
  },

  'wtAccountsInviteResendInvitationMail': function (id) {
    WtAccountsInvite.reSendInvitationMail(id);
  },

  'wtAccountsFixAllInviteStatus': function () {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized"); // Check user logged in.
    if (!Roles.userIsInRole(this.userId, ['admin'])) throw new Meteor.Error(401, "Not authorized");

    var pendingInvites = WtAccountsInviteTokens.find({accepted: false});
    pendingInvites.forEach(function (data) {
      var user = Meteor.users.findOne({'emails.address': data.email});
      if (user) {
        WtAccountsInviteTokens.update({_id: data._id}, {$set:{accepted: true}});
      }
    });
  }
});
