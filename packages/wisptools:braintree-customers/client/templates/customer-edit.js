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
  },
  'editingFirstName': function () {
    return Session.equals('braintreeCustomerEditingFirstName', this.customerId);
  },
  'editingLastName': function () {
    return Session.equals('braintreeCustomerEditingLastName', this.customerId);      
  },
  'editingPhone': function () {
    return Session.equals('braintreeCustomerEditingPhone', this.customerId);      
  },
  'editingEmail': function () {
    return Session.equals('braintreeCustomerEditingEmail', this.customerId);      
  },
  'editingAddress': function () {
    return Session.equals('braintreeCustomerEditingAddress', this.customerId);      
  },
  'editingCity': function () {
    return Session.equals('braintreeCustomerEditingCity', this.customerId);      
  },
  'editingState': function () {
    return Session.equals('braintreeCustomerEditingState', this.customerId);      
  },
  'editingZip': function () {
    return Session.equals('braintreeCustomerEditingZip', this.customerId);      
  }
});

Template.wtBraintreeEditCustomer.events({
  'click .firstName': function (e,t) {
    Session.set('braintreeCustomerEditingFirstName', this.customerId);
    Tracker.afterFlush(function() { //Focus on textfield after text is converted. 
      this.find('input#firstname').focus()
    }.bind(t));
  },
  'blur .firstName, keypress .firstName': function(e,t){  //event to save updated router name.
    var keyPressed = e.which;
    var eventType = e.type;

    if ((eventType=="keypress" && keyPressed == 13) || eventType == "focusout") { //Executed if enter is hit or on blur or tab out
      var newFirstName = e.target.value.trim();
      Session.set('braintreeCustomerEditingFirstName', null);
      
      updateCustomer('firstName', newFirstName, this._id);
    }
  },
  'click .lastName': function (e,t) {
    Session.set('braintreeCustomerEditingLastName', this.customerId);
    Tracker.afterFlush(function() { //Focus on textfield after text is converted. 
      this.find('input#lastname').focus()
    }.bind(t));
  },  
  'blur .lastName, keypress .lastName': function(e,t){  //event to save updated router name.
    var keyPressed = e.which;
    var eventType = e.type;

    if ((eventType=="keypress" && keyPressed == 13) || eventType == "focusout") { //Executed if enter is hit or on blur or tab out
      var newLastName = e.target.value.trim();
      updateCustomer('lastName', newLastName, this._id);
      Session.set('braintreeCustomerEditingLastName', null);
    }
  },
  'click .phoneNumber': function (e,t) {
    Session.set('braintreeCustomerEditingPhone', this.customerId);
    Tracker.afterFlush(function() { //Focus on textfield after text is converted. 
      this.find('input#phone').focus()
    }.bind(t));
  },  
  'blur .phoneNumber, keypress .phoneNumber': function(e,t){  //event to save updated router name.
    var keyPressed = e.which;
    var eventType = e.type;

    if ((eventType=="keypress" && keyPressed == 13) || eventType == "focusout") { //Executed if enter is hit or on blur or tab out
      var newPhone = e.target.value.trim();
      updateCustomer('phone', newPhone, this._id);
      Session.set('braintreeCustomerEditingPhone', null);
    }
  },
  'click .email': function (e,t) {
    Session.set('braintreeCustomerEditingEmail', this.customerId);
    Tracker.afterFlush(function() { //Focus on textfield after text is converted. 
      this.find('input#email').focus()
    }.bind(t));
  },  
  'blur .email, keypress .email': function(e,t){  //event to save updated router name.
    var keyPressed = e.which;
    var eventType = e.type;

    if ((eventType=="keypress" && keyPressed == 13) || eventType == "focusout") { //Executed if enter is hit or on blur or tab out
      var newEmail = e.target.value.trim();
      if (!Accounts._loginButtons.validateEmail(newEmail)) {
        WtGrowl.fail('Please enter a valid email.');
      } else {
        updateCustomer('email', newEmail, this._id);
        Session.set('braintreeCustomerEditingEmail', null);
      }
    }
  },
  'click .address': function (e,t) {
    Session.set('braintreeCustomerEditingAddress', this.customerId);
    Tracker.afterFlush(function() { //Focus on textfield after text is converted. 
      this.find('input#address').focus()
    }.bind(t));
  },  
  'blur .address, keypress .address': function(e,t){  //event to save updated router name.
    var keyPressed = e.which;
    var eventType = e.type;

    if ((eventType=="keypress" && keyPressed == 13) || eventType == "focusout") { //Executed if enter is hit or on blur or tab out
      var newAddress = e.target.value.trim();
      updateCustomer('address', newAddress, this._id);
      Session.set('braintreeCustomerEditingAddress', null);
    }
  },  
  'click .city': function (e,t) {
    Session.set('braintreeCustomerEditingCity', this.customerId);
    Tracker.afterFlush(function() { //Focus on textfield after text is converted. 
      this.find('input#city').focus()
    }.bind(t));
  },  
  'blur .city, keypress .city': function(e,t){  //event to save updated router name.
    var keyPressed = e.which;
    var eventType = e.type;

    if ((eventType=="keypress" && keyPressed == 13) || eventType == "focusout") { //Executed if enter is hit or on blur or tab out
      var newCity = e.target.value.trim();
      updateCustomer('city', newCity, this._id);
      Session.set('braintreeCustomerEditingCity', null);
    }
  },
  'click .state': function (e,t) {
    Session.set('braintreeCustomerEditingState', this.customerId);
    Tracker.afterFlush(function() { //Focus on textfield after text is converted. 
      this.find('input#state').focus()
    }.bind(t));
  },  
  'blur .state, keypress .state': function(e,t){  //event to save updated router name.
    var keyPressed = e.which;
    var eventType = e.type;

    if ((eventType=="keypress" && keyPressed == 13) || eventType == "focusout") { //Executed if enter is hit or on blur or tab out
      var newState = e.target.value.trim();
      updateCustomer('state', newState, this._id);
      Session.set('braintreeCustomerEditingState', null);
    }
  },
  'click .zip': function (e,t) {
    Session.set('braintreeCustomerEditingZip', this.customerId);
    Tracker.afterFlush(function() { //Focus on textfield after text is converted. 
      this.find('input#zip').focus()
    }.bind(t));
  },  
  'blur .zip, keypress .zip': function (e, t) {  //event to save updated router name.
    var keyPressed = e.which;
    var eventType = e.type;

    if ((eventType == "keypress" && keyPressed == 13) || eventType == "focusout") { //Executed if enter is hit or on blur or tab out
      var newZip = e.target.value.trim();
      updateCustomer('zip', newZip, this._id);
      Session.set('braintreeCustomerEditingZip', null);
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

function updateCustomer (updateFieldName, updateFieldValue, mongoRecordID) {
  var customer = Session.get('braintreeCustomer');
  var updatedCustomer = {
    firstName : customer.firstName,
    lastName : customer.lastName,
    phone : customer.phone,
    email : customer.email,
    address : customer.address,
    state : customer.state,
    city : customer.city,
    zip : customer.zip
  };

  if (!updateFieldValue) {
    WtGrowl.fail('Please fill all the fields.');
  } else {
    updatedCustomer[updateFieldName] = updateFieldValue;
    Meteor.call('wtBraintreeAPIUpdateCustomer', customer.customerId, customer.addressId, updatedCustomer.firstName, updatedCustomer.lastName, updatedCustomer.phone, updatedCustomer.email, updatedCustomer.address, updatedCustomer.city, updatedCustomer.state, updatedCustomer.zip, function (err, res) {
      if (err) {
        console.log(err);
        WtGrowl.fail('Failed to update customer.');
      } else {
        Meteor.call('wtBraintreeCustomerUpdateCustomer', mongoRecordID, updatedCustomer.firstName, updatedCustomer.lastName, updatedCustomer.phone, updatedCustomer.email, updatedCustomer.address, updatedCustomer.city, updatedCustomer.state, updatedCustomer.zip, function (e, r) {
          if (e) {
            console.log(e);
            WtGrowl.fail('Failed to update customer details.');
          } else {
            WtGrowl.success('Customer updated.');
            Router.go('wtBraintreeCustomers');
          }
        });
      }
    });
  }
}