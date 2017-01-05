Template.wtBraintreePlans.onRendered(function () {
  Session.set('braintreePlans', false);
  Meteor.call('wtBraintreeAPIGetPlans', function (e, r) {
    if (!e) {
      Session.set('braintreePlans', r);
    }
  });
});

Template.wtBraintreePlans.helpers({
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
