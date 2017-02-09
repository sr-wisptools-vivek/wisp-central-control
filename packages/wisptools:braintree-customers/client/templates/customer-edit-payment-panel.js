Template.wtBraintreePaymentMethodPanel.helpers({
  'isEdit': function () {
    var token = Session.get('braintreeEditPaymentMethod');
    if (token && this.token==token) {
      return true;
    }
    return false;
  },
  'subscriptions': function () {
    if (this.subscriptions && this.subscriptions.length>0) {
      return this.subscriptions;
    }
    return false;
  }
});

Template.wtBraintreePaymentMethodPanel.events({
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

Template.wtBraintreeSubscriptionPanel.helpers({
  'planName': function () {
    var plans = Session.get('braintreePlans');
    if (plans && plans.length>0) {
      for (var i=0; i<plans.length; i++) {
        if (plans[i].id == this.planId) {
          return plans[i].name;
        }
      }
    }
    return this.planId;
  },
  'isActive': function () {
    if (this.status == "Active") {
      return true;
    }
    return false;
  }
});

Template.wtBraintreeSubscriptionPanel.events({
  'click .cancelSubscription': function (e) {
    e.preventDefault();
    var subscriptionId = this.id;
    var customer = Session.get('braintreeCustomer');
    if (subscriptionId && customer) {
      $(e.target).attr('disabled','disabled');
      Meteor.call('wtBraintreeAPICancelSubscription', subscriptionId, function (e, r) {
        if (e) {
          console.log(e);
          $(e.target).removeAttr('disabled');
          WtGrowl.fail('Failed to cancel subscription.');
        } else {
          Meteor.call('wtBraintreeAPIGetCustomer', customer.customerId, function (e, r) {
            if (!e) {
              if (r && r.status=='success') {
                Session.set('braintreeAPICustomer', r.data);
              }
            }
          });
          WtGrowl.success('Subscription canceled.');
        }
      });
    } else {
      WtGrowl.fail('Failed to cancel subscription.');
    }
  }
});

Template.wtBraintreeAddSubscriptionPanel.helpers({
  'plans': function () {
    return Session.get('braintreePlans');
  },
  'addons': function () {
    return Session.get('braintreeAddons');
  },
  'discounts': function () {
    return Session.get('braintreeDiscounts');
  }
});

Template.wtBraintreeAddSubscriptionPanel.events({
  'click .createSubscriptionBtn': function (e) {
    e.preventDefault();
    var token = this.token;
    var planId = $(e.target).parent().parent().parent().find('select').eq(0).val();
    var addonId = $(e.target).parent().parent().parent().find('select').eq(1).val();
    var discountId = $(e.target).parent().parent().parent().find('select').eq(2).val();
    var customerId = this.customerId;
    console.log(planId);
    console.log(addonId);
    console.log(discountId);
    /*if (token && planId && customerId) {
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
    }*/
  }
});
