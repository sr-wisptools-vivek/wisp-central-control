Template.wtBraintreeEditCustomer.onRendered(function () {
  Session.set('braintreeCustomer', false);
  Session.set('braintreeAPICustomer', false);
  Session.set('braintreePlans', false);
  Session.set('braintreeForceShowAddPaymentMethodForm', false);
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
  'showTitle': function () {
    if (this.company) {
      return this.company;
    } else {
      return this.firstName + " " + this.lastName;
    }
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
  'showPaymentAddForm': function () {
    if (Session.get('braintreeForceShowAddPaymentMethodForm')) {
      return true;
    }
    if (Session.get('braintreeEditPaymentMethod')) {
      return false;
    }
    var apiCustomer = Session.get('braintreeAPICustomer');
    if (apiCustomer && apiCustomer.paymentMethods && apiCustomer.paymentMethods.length>0) {
      return false;
    }
    return true;
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
  'click .addCreditCardBtn': function (e) {
    e.preventDefault();
    Session.set('braintreeForceShowAddPaymentMethodForm', true);
    Session.set('braintreeEditPaymentMethod', false);
  },
  'click .editPaymentMethod': function (e) {
    e.preventDefault();
    Session.set('braintreeEditPaymentMethod', this.token);
    Session.set('braintreeForceShowAddPaymentMethodForm', false);
  },
  'click .cancelEditPaymentMethod': function (e) {
    e.preventDefault();
    Session.set('braintreeEditPaymentMethod', false);
  }
});

Template.wtBraintreeClickToEdit.helpers({
  'isEditing': function (fieldName) {
    return Session.equals('braintreeCustomerEditingField', fieldName);
  }
});

Template.wtBraintreeClickToEdit.events({
  'click .click-to-edit-area': function (e, t) {
    e.preventDefault();
    var _self = this;
    Session.set('braintreeCustomerEditingField', this.fieldName);
    Tracker.afterFlush(function() {
      this.find('input#'+_self.fieldName).focus();
    }.bind(t));
  },
  'blur .click-to-edit-area, keypress .click-to-edit-area': function(e, t) {
    var keyPressed = e.which;
    var eventType = e.type;
    if ((eventType=="keypress" && keyPressed == 13) || eventType == "focusout") {
      e.preventDefault();
      var newValue = e.target.value.trim();
      updateCustomer(this.fieldName, newValue, Template.parentData()._id, function () {
        Session.set('braintreeCustomerEditingField', null);
      });
    }
  }
});

function updateCustomer (updateFieldName, updateFieldValue, mongoRecordID, callback) {
  var customer = Session.get('braintreeCustomer');
  var updatedCustomer = {
    firstName : customer.firstName,
    lastName : customer.lastName,
    company : customer.company,
    phone : customer.phone,
    email : customer.email,
    address : customer.address,
    city : customer.city,
    state : customer.state,
    zip : customer.zip
  };

  if (validateCustomer(updateFieldName, updateFieldValue, updatedCustomer)) {
    updatedCustomer[updateFieldName] = updateFieldValue;
    Meteor.call('wtBraintreeAPIUpdateCustomer', customer.customerId, customer.addressId, updatedCustomer.firstName, updatedCustomer.lastName, updatedCustomer.company, updatedCustomer.phone, updatedCustomer.email, updatedCustomer.address, updatedCustomer.city, updatedCustomer.state, updatedCustomer.zip, function (err, res) {
      if (err) {
        console.log(err);
        WtGrowl.fail('Failed to update customer.');
        callback();
      } else {
        Meteor.call('wtBraintreeCustomerUpdateCustomer', mongoRecordID, updatedCustomer.firstName, updatedCustomer.lastName, updatedCustomer.company, updatedCustomer.phone, updatedCustomer.email, updatedCustomer.address, updatedCustomer.city, updatedCustomer.state, updatedCustomer.zip, function (e, r) {
          if (e) {
            console.log(e);
            WtGrowl.fail('Failed to update customer details.');
          } else {
            customer[updateFieldName] = updateFieldValue;
            Session.set('braintreeCustomer', customer);
            WtGrowl.success('Customer updated.');
          }
          callback();
        });
      }
    });
  } else {
    callback();
  }
}

function validateCustomer(updateFieldName, updateFieldValue, customer) {
  switch (updateFieldName) {
    case 'email':
      if (updateFieldValue.trim().length<1) {
        WtGrowl.fail('Email is required.');
        return false;
      } else if (!Accounts._loginButtons.validateEmail(updateFieldValue)) {
        WtGrowl.fail('Please enter a valid email.');
        return false;
      }
      break;
    case 'firstName':
      if (updateFieldValue.trim().length<1 && customer.company.length<1) {
        WtGrowl.fail('Either the Company name or the First name and Last name is required.');
        return false;
      }
      break;
    case 'lastName':
      if (updateFieldValue.trim().length<1 && customer.company.length<1) {
        WtGrowl.fail('Either the Company name or the First name and Last name is required.');
        return false;
      }
      break;
    case 'company':
      if (updateFieldValue.trim().length<1 && (customer.firstName.length<1 || customer.lastName.length<1)) {
        WtGrowl.fail('Either the Company name or the First name and Last name is required.');
        return false;
      }
      break;
  }
  return true;
}
