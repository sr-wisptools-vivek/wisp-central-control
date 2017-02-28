var showBraintreeCustomerMenu = new ReactiveVar(false);
var showBraintreeCustomerAddSubMenu = new ReactiveVar(false);
var showBraintreeCustomerListSubMenu = new ReactiveVar(false);

WtMenu.addDropdown('Customer', 'fa-sitemap', 0, ['domain-admin', 'customer'], showBraintreeCustomerMenu);
WtMenu.addDropdownItem('Customer', 'Add', 'wtBraintreeCustomersAdd', 'fa-plus', 1, ['domain-admin', 'customer'], showBraintreeCustomerAddSubMenu);
WtMenu.addDropdownItem('Customer', 'List', 'wtBraintreeCustomers', 'fa-list', 1, ['domain-admin', 'customer'], showBraintreeCustomerListSubMenu);

Meteor.call('wtBraintreeGetSettings', function (e, r) {
  if (r && r.publicKey && r.privateKey && r.merchantId) {
    showBraintreeCustomerMenu.set(true);
    showBraintreeCustomerAddSubMenu.set(true);
    showBraintreeCustomerListSubMenu.set(true);
  }
});
