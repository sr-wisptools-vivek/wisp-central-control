Template.wtBraintreeCustomers.onRendered(function () {
  Session.set('braintreeCustomers', false);
  Session.set('braintreeCustomersSearchFilter', false);
  Meteor.call('wtBraintreeCustomerGetCustomers', 10, function (e, r) {
    if (!e) {
      Session.set('braintreeCustomers', r);
    }
  });
});

Template.wtBraintreeCustomers.helpers({
  'customers': function () {
    return Session.get('braintreeCustomers');
  },
  'hasSearchFilter': function () {
    var filter = Session.get('braintreeCustomersSearchFilter');
    if (filter===false) {
      return false;
    }
    return true;
  },
  'getSearchFilter': function () {
    return Session.get('braintreeCustomersSearchFilter');
  }
});

Template.wtBraintreeCustomers.events({
  'click .addCustomerBtn': function (e) {
    e.preventDefault();
    Router.go('wtBraintreeCustomersAdd');
  },
  'click .searchBtn': function (e) {
    e.preventDefault();
    var query = $('#searchBox').val();
    Session.set('braintreeCustomersSearchFilter', query);
    Session.set('braintreeCustomers', false);
    Meteor.call('wtBraintreeCustomerGetCustomers', 10, query, function (e, r) {
      if (!e) {
        Session.set('braintreeCustomers', r);
      }
    });
  },
  'click .clearFilter': function (e) {
    e.preventDefault();
    $('#searchBox').val('');
    Session.set('braintreeCustomersSearchFilter', false);
    Session.set('braintreeCustomers', false);
    Meteor.call('wtBraintreeCustomerGetCustomers', 10, function (e, r) {
      if (!e) {
        Session.set('braintreeCustomers', r);
      }
    });
  },
  'click .detailsBtn': function (e) {
    e.preventDefault();
    Router.go('wtBraintreeCustomerDetails', {id: this._id});
  }
});
