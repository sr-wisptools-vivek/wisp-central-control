if (!WtBraintreeCustomers) {
  WtBraintreeCustomers = {};
}
WtBraintreeCustomers.collection = new WtCollection('wt_braintree_customers', function () {
  return false;
});
