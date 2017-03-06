Template.wtBraintreePaymentMethodPanel.onCreated(function () {
  this.showAddSubscriptionForm = new ReactiveVar(true);
});

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
  },
  'showAddSubscriptionForm': function () {
    return Template.instance().showAddSubscriptionForm.get();
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

Template.wtBraintreeSubscriptionPanel.onCreated(function () {
  this.requireCancelConfirmation = new ReactiveVar(false);
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
  },
  'addonName': function () {
    var names = [];
    if (this.addOns && this.addOns.length>0) {
      for (i in this.addOns) {
        names.push(this.addOns[i].name);
      }
      return names.join(', ');
    }
    return false;
  },
  'discountName': function () {
    var names = [];
    if (this.discounts && this.discounts.length>0) {
      for (i in this.discounts) {
        names.push(this.discounts[i].name);
      }
      return names.join(', ');
    }
    return false;
  },
  'requireConfirmation': function () {
    if (this.id == Template.instance().requireCancelConfirmation.get()) {
      return true;
    }
    return false;
  }
});

Template.wtBraintreeSubscriptionPanel.events({
  'click .cancelSubscriptionBtn1': function (e, t) {
    e.preventDefault();
    var subscriptionId = this.id;
    t.requireCancelConfirmation.set(subscriptionId);
  },
  'click .cancelCancelSubscription': function (e, t) {
    e.preventDefault();
    t.requireCancelConfirmation.set(false);
  },
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
    addonId = addonId?[addonId]:false;
    discountId = discountId?[discountId]:false;
    if (token && planId && customerId) {
      Meteor.call('wtBraintreeAPICreateSubscription', token, planId, addonId, discountId, function (e, r) {
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
  'click .addOneTimeCharge': function (e, t) {
    e.preventDefault();
    t.view.parentView.parentView.templateInstance().showAddSubscriptionForm.set(false);
  }
});

Template.wtBraintreeAddOneTimeChargePanel.events({
  'click .addOneTimeChargeBtn': function (e, t) {
    e.preventDefault();
    var token = this.token;
    var amount = $(e.target).parent().parent().parent().find('input').eq(0).val();
    var customerId = this.customerId;
  },
  'click .createSubscription': function (e, t) {
    e.preventDefault();
    t.view.parentView.parentView.templateInstance().showAddSubscriptionForm.set(true);
  }
});
