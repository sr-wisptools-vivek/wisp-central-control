var showBraintreePlans = new ReactiveVar(false);

WtMenu.addDropdown('Domain Admin', 'fa-sitemap', 0, ['domain-admin']);
WtMenu.addDropdownItem('Domain Admin', 'Braintree Settings', 'wtBraintreeSettings', 'fa-cog', 1, ['domain-admin']);
WtMenu.addDropdownItem('Domain Admin', 'Braintree Plans', 'wtBraintreePlans', 'fa-list', 1, ['domain-admin'], showBraintreePlans);

Meteor.call('wtBraintreeGetSettings', function (e, r) {
  if (r && r.publicKey && r.privateKey && r.merchantId) {
    showBraintreePlans.set(true);
  }
});
