Template.wtBraintreePlans.onCreated(function () {
  this.hasBraintreeSettings = new ReactiveVar(false);
  this.braintreePlans = new ReactiveVar(false);
});

Template.wtBraintreePlans.onRendered(function () {
  var hasBraintreeSettings = Template.instance().hasBraintreeSettings;
  var braintreePlans = Template.instance().braintreePlans;
  Meteor.call('wtBraintreeGetSettings', function (e, r) {
    if (r && r.publicKey && r.privateKey && r.merchantId) {
      hasBraintreeSettings.set(true);
      Meteor.call('wtBraintreeAPIGetPlans', function (e, r) {
        if (!e) {
          braintreePlans.set(r);
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
    var plans = Template.instance().braintreePlans.get();
    if (plans) {
      return true;
    }
    return false;
  },
  'plans': function () {
    return Template.instance().braintreePlans.get();
  }
});
