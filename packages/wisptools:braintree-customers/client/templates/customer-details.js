Template.wtBraintreeCustomerDetails.onRendered(function () {
  Session.set('braintreeCustomer', false);
  Meteor.call('wtBraintreeCustomerGetCustomer', this.data.id, function (e, r) {
    if (!e) {
      Session.set('braintreeCustomer', r);
    }
  });
});

Template.wtBraintreeCustomerDetails.helpers({
  'customer': function () {
    return Session.get('braintreeCustomer');
  }
});
