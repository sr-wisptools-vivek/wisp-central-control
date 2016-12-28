BraintreeAPI = {};

Braintree = Npm.require('braintree');
Future = Npm.require('fibers/future');

var environment = Braintree.Environment.Sandbox;
if (Meteor.settings.braintree.environment == "production") {
  environment = Braintree.Environment.Production;
}

var gateway = Braintree.connect({
  environment: environment,
  merchantId: Meteor.settings.braintree.merchantId,
  publicKey: Meteor.settings.braintree.publicKey,
  privateKey: Meteor.settings.braintree.privateKey
});

BraintreeAPI.createCustomer = function (firstName, lastName, company, email, phone, callback) {
  if (!firstName || !lastName || !company || !email || !phone) {
    throw new Meteor.Error("braintree-error", 'Braintree create customer - Invalid parameters.');
  }
  if (callback && typeof(callback)!=="function") {
    throw new Meteor.Error("braintree-error", 'Callback should be a function.');
  }

  gateway.customer.create({
    firstName: firstName,
    lastName: lastName,
    company: company,
    email: email,
    phone: phone
  }, callback);
};
