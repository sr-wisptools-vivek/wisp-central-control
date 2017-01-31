Template.wtBraintreeEditCustomer.onRendered(function () {
  Session.set('braintreeCustomer', false);
  Session.set('braintreeAPICustomer', false);
  Session.set('braintreePlans', false);
  Session.set('braintreeEditPaymentMethod', false);
  Meteor.call('wtBraintreeCustomerGetCustomer', this.data.id, function (e, r) {
    if (!e) {
      if (r) {
        Session.set('braintreeCustomer', r);
        Meteor.call('wtBraintreeAPIGetCustomer', r.customerId, function (e, r) {
          if (!e) {
            if (r && r.status=='success') {
              Session.set('braintreeAPICustomer', r.data);
            }
          }
        });
      }
    }
  });
  Meteor.call('wtBraintreeAPIGetPlans', function (e, r) {
    if (!e) {
      Session.set('braintreePlans', r);
    }
  });
});

Template.wtBraintreeEditCustomer.helpers({
  'customer': function () {
    return Session.get('braintreeCustomer');
  },
  'apicustomer': function () {
    return Session.get('braintreeAPICustomer');
  },
  'paymentmethods': function () {
    var customer = Session.get('braintreeAPICustomer');
    var paymentmethods = [];
    if (customer && customer.paymentMethods && customer.paymentMethods.length > 0) {
      for (var i=0; i<customer.paymentMethods.length; i++) {
        paymentmethods.push(customer.paymentMethods[i]);
      }
    }
    if (paymentmethods.length<1) {
      return false;
    }
    return paymentmethods;
  },
  'subscriptions': function () {
    var customer = Session.get('braintreeAPICustomer');
    var subscriptions = [];
    if (customer && customer.paymentMethods && customer.paymentMethods.length > 0) {
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
  'subscriptionscount': function () {
    if (this.subscriptions && this.subscriptions.length>0) {
      return this.subscriptions.length;
    }
    return 0;
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
  },
  'plans': function () {
    return Session.get('braintreePlans');
  },
  'isEdit': function () {
    var token = Session.get('braintreeEditPaymentMethod');
    if (token && this.token==token) {
      return true;
    }
    return false;
  },
  'showPaymentEditForm': function () {
    var token = Session.get('braintreeEditPaymentMethod');
    if (token) {
      return true;
    }
    return false;
  }
});

Template.wtBraintreeEditCustomer.events({
  'click .updateCustomer': function (e) {
    e.preventDefault();
    var firstname = $('#firstname').val();
    var lastname = $('#lastname').val();
    var companyname = $('#companyname').val();
    var phone = $('#phone').val();
    var email = $('#email').val();
    var address = $('#address').val();
    var city = $('#city').val();
    var state = $('#state').val();
    var zip = $('#zip').val();
    var mongo_record_id = this._id;
    if (!email) {
      WtGrowl.fail('Email field is required.');
    } else if (!(!!firstname && !!lastname) && !companyname) {
      WtGrowl.fail('Either the Company name or the First name and Last name is required.');
    } else if (!Accounts._loginButtons.validateEmail(email)) {
      WtGrowl.fail('Please enter a valid email.');
    } else {
      Meteor.call('wtBraintreeAPIUpdateCustomer', this.customerId, this.addressId, firstname, lastname, companyname, phone, email, address, city, state, zip, function (err, res) {
        if (err) {
          console.log(err);
          WtGrowl.fail('Failed to update customer.');
        } else {
          Meteor.call('wtBraintreeCustomerUpdateCustomer', mongo_record_id, firstname, lastname, companyname, phone, email, address, city, state, zip, function (e, r) {
            if (e) {
              console.log(e);
              WtGrowl.fail('Failed to update customer details.');
            } else {
              WtGrowl.success('Customer updated.');
            }
          });
        }
      });
    }
  },
  'click .createSubscriptionBtn': function (e) {
    e.preventDefault();
    var token = this.token;
    var planId = $(e.target).parent().find('select').val();
    var customerId = this.customerId;
    if (token && planId && customerId) {
      Meteor.call('wtBraintreeAPICreateSubscription', token, planId, function (e, r) {
        if (e) {
          console.log(e);
          WtGrowl.fail('Failed to create subscription.');
        } else {
          Meteor.call('wtBraintreeAPIGetCustomer', customerId, function (e, r) {
            if (!e) {
              if (r && r.status=='success') {
                Session.set('braintreeAPICustomer', r.data);
              }
            }
          });
          WtGrowl.success('New Subscription created.');
        }
      });
    } else {
      WtGrowl.fail('Please select a valid plan.')
    }
  },
  'click .editPaymentMethod': function (e) {
    e.preventDefault();
    Session.set('braintreeEditPaymentMethod', this.token);
  },
  'click .cancelEditPaymentMethod': function (e) {
    e.preventDefault();
    Session.set('braintreeEditPaymentMethod', false);
  }
});
