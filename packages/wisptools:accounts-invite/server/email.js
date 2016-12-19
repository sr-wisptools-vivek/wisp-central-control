WtAccountsInvite = {};

WtAccountsInvite.sendInvitationMail = function (email, token, domain) {
  var options = {
    to: email,
    from: Meteor.settings.email.from,
    subject: "You have been invited to join a domain."
  };

  var message = 'You are invited to join a domain - ' + domain + '.';
  message += "\nPlease click the link below to accept the invitation.";
  var url = Meteor.absoluteUrl() + 'invite/' + token;

  options.text = 'Hello,';
  options.text += "\n\n" + message;
  options.text += "\n\n" + url;
  options.text += "\n\nThanks.";

  Email.send(options);
};

WtAccountsInvite.reSendInvitationMail = function (id) {
  var invitation = WtAccountsInviteTokens.findOne({_id : id});
  if (invitation) {
    var options = {
      to: invitation.email,
      from: Meteor.settings.email.from,
      subject: "You have been invited to join a domain."
    };

    var message = 'You are invited to join a domain - ' + invitation.domain + '.';
    message += "\nPlease click the link below to accept the invitation.";
    var url = Meteor.absoluteUrl() + 'invite/' + invitation.token;

    options.text = 'Hello,';
    options.text += "\n\n" + message;
    options.text += "\n\n" + url;
    options.text += "\n\nThanks.";

    Email.send(options);
  }
};
