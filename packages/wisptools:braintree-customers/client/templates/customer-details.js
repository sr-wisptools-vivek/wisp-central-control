Template.wtBraintreeCustomerDetails.onRendered(function () {
  Session.set('braintreeCustomer', false);
  Session.set('braintreeAPICustomer', false);
  Session.set('braintreePlans', false);
  Meteor.call('wtBraintreeCustomerGetCustomer', this.data.id, function (e, r) {
    if (!e) {
      Session.set('braintreeCustomer', r);
      Meteor.call('wtBraintreeAPIGetCustomer', r.customerId, function (e, r) {
        if (!e) {
          if (r && r.status=='success') {
            Session.set('braintreeAPICustomer', r.data);
          }
        }
      });
    }
  });
  Meteor.call('wtBraintreeAPIGetPlans', function (e, r) {
    if (!e) {
      Session.set('braintreePlans', r);
    }
  });
});

Template.wtBraintreeCustomerDetails.helpers({
  'customer': function () {
    return Session.get('braintreeCustomer');
  },
  'apicustomer': function () {
    return Session.get('braintreeAPICustomer');
  },
  'subscriptions': function () {
    var customer = Session.get('braintreeAPICustomer');
    var subscriptions = [];
    if (customer.paymentMethods && customer.paymentMethods.length > 0) {
      for (var i=0; i<customer.paymentMethods.length; i++) {
        if (customer.paymentMethods[i].subscriptions && customer.paymentMethods[i].subscriptions.length>0) {
          for (var j=0; j<customer.paymentMethods[i].subscriptions.length; j++) {
            subscriptions.push(customer.paymentMethods[i].subscriptions[j]);
          }
        }
      }
    }
    if (subscriptions.length<1) {
      return false;
    }
    return subscriptions;
  },
  'planName': function (planId) {
    var plans = Session.get('braintreePlans');
    if (plans && plans.length>0) {
      for (var i=0; i<plans.length; i++) {
        if (plans[i].id == planId) {
          return plans[i].name;
        }
      }
    }
    return planId;
  }
});
