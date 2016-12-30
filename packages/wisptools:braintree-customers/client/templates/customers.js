Template.wtBraintreeCustomers.onRendered(function () {
  Session.set('braintreeCustomers', false);
  Meteor.call('wtBraintreeCustomerGetCustomers', 10, function (e, r) {
    if (!e) {
      Session.set('braintreeCustomers', r);
    }
  });
});

Template.wtBraintreeCustomers.helpers({
  'customers': function () {
    return Session.get('braintreeCustomers');;
  }
});
