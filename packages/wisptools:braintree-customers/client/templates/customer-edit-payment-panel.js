Template.wtBraintreePaymentMethodPanel.onCreated(function () {
  this.showAddSubscriptionForm = new ReactiveVar(true);
  this.showTransactionsPanel = new ReactiveVar(false);
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
  },
  'showTransactionsPanel': function () {
    return Template.instance().showTransactionsPanel.get();
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
  },
  'click .showTransactionsPanelBtn': function (e, t) {
    e.preventDefault();
    var showTransactionsPanel = t.showTransactionsPanel.get();
    t.showTransactionsPanel.set(!showTransactionsPanel);
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
    var _event = e;

    if (token && amount && customerId) {
      Meteor.call('wtBraintreeAPICreateSaleTransaction', token, amount, function (e, r) {
        if (e) {
          console.log(e);
          WtGrowl.fail('Failed to add one time charge.');
        } else {
          if (r.status == "error") {
            WtGrowl.fail(r.msg);
          } else {
            WtGrowl.success('One time charge added.');
            $(_event.target).parent().parent().parent().find('input').eq(0).val('');
          }
        }
      });
    } else {
      WtGrowl.fail('Please enter a valid amount.');
    }
  },
  'click .createSubscription': function (e, t) {
    e.preventDefault();
    t.view.parentView.parentView.templateInstance().showAddSubscriptionForm.set(true);
  }
});

Template.wtBraintreeTransactionsPanel.onCreated(function () {
  this.transactionsList = new ReactiveVar(false);
});

Template.wtBraintreeTransactionsPanel.onRendered(function () {
  var instance = Template.instance();
  var _self = this;
  Meteor.call('wtBraintreeAPISearchTransactions', this.data.customerId, function (e, r) {
    if (r && r.status && r.status == "success") {
      var transactionsList = r.data;
      var cardTransactionsList = [];
      for (var i=0; i<transactionsList.length; i++) {
        if (transactionsList[i].creditCard && transactionsList[i].creditCard.token == _self.data.token) {
          cardTransactionsList.push(transactionsList[i]);
        }
      }
      instance.transactionsList.set(cardTransactionsList);
    }
  });
});

Template.wtBraintreeTransactionsPanel.helpers({
  'transactions': function () {
    return Template.instance().transactionsList.get();
  },
  'recurringMsg': function () {
    if (this.recurring) {
      return "Yes";
    } else {
      return "No";
    }
  },
  'date': function () {
    return new Date(this.createdAt);
  }
});
