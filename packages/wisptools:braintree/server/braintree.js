BraintreeAPI = {};

Braintree = Npm.require('braintree');
Future = Npm.require('fibers/future');

var gateway = false;

BraintreeAPI.connect = function (environment, merchantId, publicKey, privateKey) {
  if (environment == "production") {
    environment = Braintree.Environment.Production;
  } else {
    environment = Braintree.Environment.Sandbox;
  }
  gateway = Braintree.connect({
    environment: environment,
    merchantId: merchantId,
    publicKey: publicKey,
    privateKey: privateKey
  });
};

BraintreeAPI.createCustomer = function (firstName, lastName, email, phone, callback) {
  if (!firstName || !lastName || !email || !phone) {
    throw new Meteor.Error("braintree-error", 'Braintree create customer - Invalid parameters.');
  }
  if (callback && typeof(callback)!=="function") {
    throw new Meteor.Error("braintree-error", 'Callback should be a function.');
  }
  if (!gateway) {
    throw new Meteor.Error("braintree-error", 'Failed to connect to Braintree.');
  }

  gateway.customer.create({
    firstName: firstName,
    lastName: lastName,
    email: email,
    phone: phone
  }, callback);
};

BraintreeAPI.createAddress = function (customerId, firstName, lastName, streetAddress, locality, region, postalCode, callback) {
  if (!customerId || !firstName || !lastName || !streetAddress || !locality || !region || !postalCode) {
    throw new Meteor.Error("braintree-error", 'Braintree create address - Invalid parameters.');
  }
  if (callback && typeof(callback)!=="function") {
    throw new Meteor.Error("braintree-error", 'Callback should be a function.');
  }
  if (!gateway) {
    throw new Meteor.Error("braintree-error", 'Failed to connect to Braintree.');
  }

  gateway.address.create({
    customerId: customerId,
    firstName: firstName,
    lastName: lastName,
    streetAddress: streetAddress,
    locality: locality,
    region: region,
    postalCode: postalCode
  }, callback);
};
