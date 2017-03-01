Template.wtBraintreePlans.onCreated(function () {
  this.hasBraintreeSettings = new ReactiveVar(false);
});

Template.wtBraintreePlans.onRendered(function () {
  Session.set('braintreePlans', false);
  var hasBraintreeSettings = Template.instance().hasBraintreeSettings;
  Meteor.call('wtBraintreeGetSettings', function (e, r) {
    if (r && r.publicKey && r.privateKey && r.merchantId) {
      hasBraintreeSettings.set(true);
      Meteor.call('wtBraintreeAPIGetPlans', function (e, r) {
        if (!e) {
          Session.set('braintreePlans', r);
        }
      });
    }
  });
});

Template.wtBraintreePlans.helpers({
  'hasBraintreeSettings': function () {
    return Template.instance().hasBraintreeSettings.get();
  },
  'hasPlans': function () {
    var plans = Session.get('braintreePlans');
    if (plans) {
      return true;
    }
    return false;
  },
  'plans': function () {
    return Session.get('braintreePlans');
  }
});
