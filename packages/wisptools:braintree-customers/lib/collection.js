if (!WtBraintreeCustomers) {
  WtBraintreeCustomers = {};
}
WtBraintreeCustomers.collection = new WtCollection('wt_braintree_customers', function () {
  return false;
});
WtBraintreeCustomers.managedRouterCollection = new WtCollection('wt_braintree_customers_managed_routers');
