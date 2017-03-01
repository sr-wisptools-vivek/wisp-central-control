Template.wtBraintreeCustomers.onCreated(function () {
  this.hasBraintreeSettings = new ReactiveVar(false);
  this.braintreeCustomers = new ReactiveVar(false);
  this.braintreeCustomersSearchFilter = new ReactiveVar(false);
});

Template.wtBraintreeCustomers.onRendered(function () {
  var hasBraintreeSettings = Template.instance().hasBraintreeSettings;
  var braintreeCustomers = Template.instance().braintreeCustomers;
  Meteor.call('wtBraintreeGetSettings', function (e, r) {
    if (r && r.publicKey && r.privateKey && r.merchantId) {
      hasBraintreeSettings.set(true);
      Meteor.call('wtBraintreeCustomerGetCustomers', 10, function (e, r) {
        if (!e) {
          braintreeCustomers.set(r);
        }
      });
    }
  });
});

Template.wtBraintreeCustomers.helpers({
  'hasBraintreeSettings': function () {
    return Template.instance().hasBraintreeSettings.get();
  },
  'customers': function () {
    return Template.instance().braintreeCustomers.get();
  },
  'hasSearchFilter': function () {
    var filter = Template.instance().braintreeCustomersSearchFilter.get();
    if (filter===false) {
      return false;
    }
    return true;
  },
  'getSearchFilter': function () {
    return Template.instance().braintreeCustomersSearchFilter.get();
  }
});

Template.wtBraintreeCustomers.events({
  'click .addCustomerBtn': function (e) {
    e.preventDefault();
    Router.go('wtBraintreeCustomersAdd');
  },
  'click .searchBtn': function (e, t) {
    e.preventDefault();
    var query = $('#searchBox').val();
    if (query.trim().length>0) {
      t.braintreeCustomersSearchFilter.set(query);
      t.braintreeCustomers.set(false);
      Meteor.call('wtBraintreeCustomerGetCustomers', 10, query, function (e, r) {
        if (!e) {
          t.braintreeCustomers.set(r);
        }
      });
    }
  },
  'click .clearFilter': function (e, t) {
    e.preventDefault();
    $('#searchBox').val('');
    t.braintreeCustomersSearchFilter.set(false);
    t.braintreeCustomers.set(false);
    Meteor.call('wtBraintreeCustomerGetCustomers', 10, function (e, r) {
      if (!e) {
        t.braintreeCustomers.set(r);
      }
    });
  },
  'click .editBtn': function (e) {
    e.preventDefault();
    Router.go('wtBraintreeEditCustomer', {id: this._id});
  }
});
