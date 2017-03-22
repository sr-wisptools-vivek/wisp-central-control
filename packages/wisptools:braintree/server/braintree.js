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

BraintreeAPI.createCustomer = function (firstName, lastName, companyname, email, phone, callback) {
  if (!email || (!!email && (!(!!firstName && !!lastName) && !companyname))) {
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
    company: companyname,
    email: email,
    phone: phone
  }, callback);
};

BraintreeAPI.updateCustomer = function (customerId, firstName, lastName, companyname, email, phone, callback) {
  if (!email || (!!email && (!(!!firstName && !!lastName) && !companyname))) {
    throw new Meteor.Error("braintree-error", 'Braintree update customer - Invalid parameters.');
  }
  if (callback && typeof(callback)!=="function") {
    throw new Meteor.Error("braintree-error", 'Callback should be a function.');
  }
  if (!gateway) {
    throw new Meteor.Error("braintree-error", 'Failed to connect to Braintree.');
  }

  gateway.customer.update(customerId, {
    firstName: firstName,
    lastName: lastName,
    company: companyname,
    email: email,
    phone: phone
  }, callback);
};

BraintreeAPI.createAddress = function (customerId, firstName, lastName, streetAddress, locality, region, postalCode, callback) {
  if (!customerId) {
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

BraintreeAPI.updateAddress = function (customerId, addressId, firstName, lastName, streetAddress, locality, region, postalCode, callback) {
  if (!customerId || !addressId) {
    throw new Meteor.Error("braintree-error", 'Braintree update address - Invalid parameters.');
  }
  if (callback && typeof(callback)!=="function") {
    throw new Meteor.Error("braintree-error", 'Callback should be a function.');
  }
  if (!gateway) {
    throw new Meteor.Error("braintree-error", 'Failed to connect to Braintree.');
  }

  gateway.address.update(customerId, addressId, {
    firstName: firstName,
    lastName: lastName,
    streetAddress: streetAddress,
    locality: locality,
    region: region,
    postalCode: postalCode
  }, callback);
};

BraintreeAPI.getPlans = function (callback) {
  if (callback && typeof(callback)!=="function") {
    throw new Meteor.Error("braintree-error", 'Callback should be a function.');
  }
  if (!gateway) {
    throw new Meteor.Error("braintree-error", 'Failed to connect to Braintree.');
  }

  gateway.plan.all(callback);
};

BraintreeAPI.getCustomer = function (customerId, callback) {
  if (!customerId) {
    throw new Meteor.Error("braintree-error", 'Braintree get customer - Invalid parameter.');
  }
  if (callback && typeof(callback)!=="function") {
    throw new Meteor.Error("braintree-error", 'Callback should be a function.');
  }
  if (!gateway) {
    throw new Meteor.Error("braintree-error", 'Failed to connect to Braintree.');
  }

  gateway.customer.find(customerId, callback);
};

BraintreeAPI.createClientToken = function (callback) {
  if (callback && typeof(callback)!=="function") {
    throw new Meteor.Error("braintree-error", 'Callback should be a function.');
  }
  if (!gateway) {
    throw new Meteor.Error("braintree-error", 'Failed to connect to Braintree.');
  }

  gateway.clientToken.generate({}, callback);
};

BraintreeAPI.createPaymentMethod = function (customerId, paymentMethodNonce, cardholderName, callback) {
  if (!customerId || !paymentMethodNonce) {
    throw new Meteor.Error("braintree-error", 'Braintree create payment method - Invalid parameters.');
  }
  if (callback && typeof(callback)!=="function") {
    throw new Meteor.Error("braintree-error", 'Callback should be a function.');
  }
  if (!gateway) {
    throw new Meteor.Error("braintree-error", 'Failed to connect to Braintree.');
  }
  if (!cardholderName) {
    cardholderName = "";
  }

  gateway.paymentMethod.create({
    customerId: customerId,
    paymentMethodNonce: paymentMethodNonce,
    cardholderName: cardholderName
  }, callback);
};

BraintreeAPI.updatePaymentMethod = function (token, paymentMethodNonce, cardholderName, callback) {
  if (!token || !paymentMethodNonce) {
    throw new Meteor.Error("braintree-error", 'Braintree update payment method - Invalid parameters.');
  }
  if (callback && typeof(callback)!=="function") {
    throw new Meteor.Error("braintree-error", 'Callback should be a function.');
  }
  if (!gateway) {
    throw new Meteor.Error("braintree-error", 'Failed to connect to Braintree.');
  }
  if (!cardholderName) {
    cardholderName = "";
  }

  gateway.paymentMethod.update(token, {
    paymentMethodNonce: paymentMethodNonce,
    cardholderName: cardholderName
  }, callback);
};

BraintreeAPI.createSubscription = function (paymentMethodToken, planId, addons, discounts, callback) {
  if (!paymentMethodToken || !planId) {
    throw new Meteor.Error("braintree-error", 'Braintree create subscription - Invalid parameters.');
  }
  if (callback && typeof(callback)!=="function") {
    throw new Meteor.Error("braintree-error", 'Callback should be a function.');
  }
  if (!gateway) {
    throw new Meteor.Error("braintree-error", 'Failed to connect to Braintree.');
  }
  if (!addons) {
    addons = [];
  }
  if (!discounts) {
    discounts = [];
  }

  gateway.subscription.create({
    paymentMethodToken: paymentMethodToken,
    planId: planId,
    addOns: addons,
    discounts: discounts
  }, callback);
};

BraintreeAPI.cancelSubscription = function (subscriptionId, callback) {
  if (!subscriptionId) {
    throw new Meteor.Error("braintree-error", 'Braintree cancel subscription - Invalid parameters.');
  }
  if (callback && typeof(callback)!=="function") {
    throw new Meteor.Error("braintree-error", 'Callback should be a function.');
  }
  if (!gateway) {
    throw new Meteor.Error("braintree-error", 'Failed to connect to Braintree.');
  }

  gateway.subscription.cancel(subscriptionId, callback);
};

BraintreeAPI.getAddons = function (callback) {
  if (callback && typeof(callback)!=="function") {
    throw new Meteor.Error("braintree-error", 'Callback should be a function.');
  }
  if (!gateway) {
    throw new Meteor.Error("braintree-error", 'Failed to connect to Braintree.');
  }

  gateway.addOn.all(callback);
};

BraintreeAPI.getDiscounts = function (callback) {
  if (callback && typeof(callback)!=="function") {
    throw new Meteor.Error("braintree-error", 'Callback should be a function.');
  }
  if (!gateway) {
    throw new Meteor.Error("braintree-error", 'Failed to connect to Braintree.');
  }

  gateway.discount.all(callback);
};

BraintreeAPI.createSaleTransaction = function (paymentMethodToken, amount, callback) {
  if (!paymentMethodToken || !amount) {
    throw new Meteor.Error("braintree-error", 'Braintree create sale transaction - Invalid parameters.');
  }
  if (callback && typeof(callback)!=="function") {
    throw new Meteor.Error("braintree-error", 'Callback should be a function.');
  }
  if (!gateway) {
    throw new Meteor.Error("braintree-error", 'Failed to connect to Braintree.');
  }

  gateway.transaction.sale({
    paymentMethodToken: paymentMethodToken,
    amount: amount,
    options: {
      submitForSettlement: true
    }
  }, callback);
};

BraintreeAPI.searchTransactions = function (customerId, callback) {
  if (!customerId) {
    throw new Meteor.Error("braintree-error", 'Braintree search transaction - Invalid parameters.');
  }
  if (callback && typeof(callback)!=="function") {
    throw new Meteor.Error("braintree-error", 'Callback should be a function.');
  }
  if (!gateway) {
    throw new Meteor.Error("braintree-error", 'Failed to connect to Braintree.');
  }

  gateway.transaction.search(function (search) {
    search.customerId().is(customerId);
  }, callback);
};
