if (!WtBraintreeSettings) {
  WtBraintreeSettings = {};
}
WtBraintreeSettings.collection = new WtCollection('wt_braintree_settings', function () {
  return false;
});
