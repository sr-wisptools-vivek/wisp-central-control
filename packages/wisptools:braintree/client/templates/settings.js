Template.wtBraintreeSettings.onRendered(function () {
  Session.set('braintreeSettings', {});
  Meteor.call('wtBraintreeGetSettings', function (e, r) {
    if (!e) {
      Session.set('braintreeSettings', r);
    }
  });
});

Template.wtBraintreeSettings.helpers({
  'braintreeSettings': function () {
    return Session.get('braintreeSettings');
  },
  'selected': function (env) {
    if (this.environment == env) {
      return "selected";
    }
    return "";
  }
});

Template.wtBraintreeSettings.events({
  'click .saveSettings': function (e) {
    e.preventDefault();
    var publickey = $('#publickey').val();
    var privatekey = $('#privatekey').val();
    var environment = $('#environment').val();
    var merchantid = $('#merchantid').val();
    Meteor.call('wtBraintreeUpdateSettings', publickey, privatekey, environment, merchantid, function (e, r) {
      if (e) {
        WtGrowl.fail('Failed to update Braintree settings.');
      } else {
        WtGrowl.success('Braintree settings updated.');
      }
    });
  }
});
