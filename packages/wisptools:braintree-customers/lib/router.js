Router.route('/braintree-customers', {
  name: 'wtBraintreeCustomers',
  template: 'wtBraintreeCustomers'
});

Router.route('/braintree-customers-add', {
  name: 'wtBraintreeCustomersAdd',
  template: 'wtBraintreeCustomersAdd'
});

Router.route('/braintree-customer/:id', {
  name: 'wtBraintreeCustomerDetails',
  template: 'wtBraintreeCustomerDetails',
  data: function () {
    return {id: this.params.id};
  }
});

Router.route('/braintree-customer/edit/:id', {
  name: 'wtBraintreeEditCustomer',
  template: 'wtBraintreeEditCustomer',
  data: function () {
    return {id: this.params.id};
  }
});
