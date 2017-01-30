Meteor.methods({
  'wtBraintreeGetSettings': function () {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized");
    if (!Roles.userIsInRole(this.userId, ['domain-admin'])) throw new Meteor.Error(401, "Not authorized");

    var braintreeSettings = WtBraintreeSettings.collection.findOne({owner: this.userId});
    if (braintreeSettings) {
      braintreeSettings.privateKey = WtAES.decrypt(braintreeSettings.privateKey);
      return braintreeSettings;
    } else {
      return {};
    }
  },
  'wtBraintreeUpdateSettings': function (publicKey, privateKey, environment, merchantId) {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized");
    if (!Roles.userIsInRole(this.userId, ['domain-admin'])) throw new Meteor.Error(401, "Not authorized");
    privateKey = WtAES.encrypt(privateKey);

    var braintreeSettings = WtBraintreeSettings.collection.findOne({owner: this.userId});
    if (braintreeSettings) {
      WtBraintreeSettings.collection.update({owner: this.userId}, {$set: {
        publicKey: publicKey,
        privateKey: privateKey,
        environment: environment,
        merchantId: merchantId
      }});
    } else {
      WtBraintreeSettings.collection.insert({
        publicKey: publicKey,
        privateKey: privateKey,
        environment: environment,
        merchantId: merchantId,
        owner: this.userId
      });
    }
  },
  'wtBraintreeAPIAddCustomer': function (firstName, lastName, companyname, phone, email, address, city, state, zip) {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized");
    if (!Roles.userIsInRole(this.userId, ['domain-admin'])) throw new Meteor.Error(401, "Not authorized");

    var braintreeSettings = Meteor.call('wtBraintreeGetSettings');
    if (!braintreeSettings) {
      throw new Meteor.Error(401, "Failed to connect to Braintree.");
    }
    BraintreeAPI.connect(braintreeSettings.environment, braintreeSettings.merchantId, braintreeSettings.publicKey, braintreeSettings.privateKey);

    var myFuture = new Future();
    BraintreeAPI.createCustomer(firstName, lastName, companyname, email, phone, function (err, res) {
      if (err) {
        myFuture.return({status: "error", msg: err.message});
      } else {
        if (res.success) {
          myFuture.return({status: "success", data: res.customer});
        } else {
          myFuture.return({status: "error", msg: res.message});
        }
      }
    });
    var result1 = myFuture.wait();
    if (result1.status == "success") {
      var myFuture = new Future();
      BraintreeAPI.createAddress(result1.data.id, firstName, lastName, address, city, state, zip, function (err, res) {
        if (err) {
          myFuture.return({status: "error", msg: err.message});
        } else {
          if (res.success) {
            myFuture.return({status: "success", data: res});
          } else {
            myFuture.return({status: "error", msg: res.message});
          }
        }
      });
      var result2 = myFuture.wait();
      if (result2.status == "error") {
        throw new Meteor.Error("braintree-error", result2.msg);
      }
    } else {
      throw new Meteor.Error("braintree-error", result1.msg);
    }
    return {
      customer: result1.data,
      address: result2.data
    }
  },
  'wtBraintreeAPIUpdateCustomer': function (customerId, addressId, firstName, lastName, companyname, phone, email, address, city, state, zip) {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized");
    if (!Roles.userIsInRole(this.userId, ['domain-admin'])) throw new Meteor.Error(401, "Not authorized");

    var braintreeSettings = Meteor.call('wtBraintreeGetSettings');
    if (!braintreeSettings) {
      throw new Meteor.Error(401, "Failed to connect to Braintree.");
    }
    BraintreeAPI.connect(braintreeSettings.environment, braintreeSettings.merchantId, braintreeSettings.publicKey, braintreeSettings.privateKey);

    var myFuture = new Future();
    BraintreeAPI.updateCustomer(customerId, firstName, lastName, companyname, email, phone, function (err, res) {
      if (err) {
        myFuture.return({status: "error", msg: err.message});
      } else {
        if (res.success) {
          myFuture.return({status: "success", data: res.customer});
        } else {
          myFuture.return({status: "error", msg: res.message});
        }
      }
    });
    var result1 = myFuture.wait();
    if (result1.status == "success") {
      var myFuture = new Future();
      BraintreeAPI.updateAddress(customerId, addressId, firstName, lastName, address, city, state, zip, function (err, res) {
        if (err) {
          myFuture.return({status: "error", msg: err.message});
        } else {
          if (res.success) {
            myFuture.return({status: "success", data: res});
          } else {
            myFuture.return({status: "error", msg: res.message});
          }
        }
      });
      var result2 = myFuture.wait();
      if (result2.status == "error") {
        throw new Meteor.Error("braintree-error", result2.msg);
      }
    } else {
      throw new Meteor.Error("braintree-error", result1.msg);
    }
    return result1.data;
  },
  'wtBraintreeAPIGetPlans': function () {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized");
    if (!Roles.userIsInRole(this.userId, ['domain-admin'])) throw new Meteor.Error(401, "Not authorized");

    var braintreeSettings = Meteor.call('wtBraintreeGetSettings');
    if (!braintreeSettings) {
      throw new Meteor.Error(401, "Failed to connect to Braintree.");
    }
    BraintreeAPI.connect(braintreeSettings.environment, braintreeSettings.merchantId, braintreeSettings.publicKey, braintreeSettings.privateKey);

    var myFuture = new Future();
    BraintreeAPI.getPlans(function (err, res) {
      if (err) {
        myFuture.return({status: "error", msg: err.message});
      } else {
        if (res && res.success) {
          myFuture.return({status: "success", data: res.plans});
        } else {
          myFuture.return({status: "error", msg: "No plans found"});
        }
      }
    });
    var result = myFuture.wait();

    return result.data;
  },
  'wtBraintreeAPIGetCustomer': function (customerId) {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized");
    if (!Roles.userIsInRole(this.userId, ['domain-admin'])) throw new Meteor.Error(401, "Not authorized");

    var braintreeSettings = Meteor.call('wtBraintreeGetSettings');
    if (!braintreeSettings) {
      throw new Meteor.Error(401, "Failed to connect to Braintree.");
    }
    BraintreeAPI.connect(braintreeSettings.environment, braintreeSettings.merchantId, braintreeSettings.publicKey, braintreeSettings.privateKey);

    var myFuture = new Future();
    BraintreeAPI.getCustomer(customerId, function (err, res) {
      if (err) {
        myFuture.return({status: "error", msg: err.message});
      } else {
        if (res) {
          myFuture.return({status: "success", data: res});
        } else {
          myFuture.return({status: "error", msg: "No customer found"});
        }
      }
    });
    var result = myFuture.wait();

    return result;
  },
  'wtBraintreeAPICreateClientToken': function () {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized");
    if (!Roles.userIsInRole(this.userId, ['domain-admin'])) throw new Meteor.Error(401, "Not authorized");

    var braintreeSettings = Meteor.call('wtBraintreeGetSettings');
    if (!braintreeSettings) {
      throw new Meteor.Error(401, "Failed to connect to Braintree.");
    }
    BraintreeAPI.connect(braintreeSettings.environment, braintreeSettings.merchantId, braintreeSettings.publicKey, braintreeSettings.privateKey);

    var myFuture = new Future();
    BraintreeAPI.createClientToken(function (err, res) {
      if (err) {
        myFuture.return({status: "error", msg: err.message});
      } else {
        if (res && res.success) {
          myFuture.return({status: "success", data: res.clientToken});
        } else {
          myFuture.return({status: "error", msg: "An error has occurred"});
        }
      }
    });
    var result = myFuture.wait();

    return result;
  },
  'wtBraintreeAPICreatePaymentMethod': function (customerId, paymentMethodNonce, cardholderName) {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized");
    if (!Roles.userIsInRole(this.userId, ['domain-admin'])) throw new Meteor.Error(401, "Not authorized");

    var braintreeSettings = Meteor.call('wtBraintreeGetSettings');
    if (!braintreeSettings) {
      throw new Meteor.Error(401, "Failed to connect to Braintree.");
    }
    BraintreeAPI.connect(braintreeSettings.environment, braintreeSettings.merchantId, braintreeSettings.publicKey, braintreeSettings.privateKey);

    var myFuture = new Future();
    BraintreeAPI.createPaymentMethod(customerId, paymentMethodNonce, cardholderName, function (err, res) {
      if (err) {
        myFuture.return({status: "error", msg: err.message});
      } else {
        if (res) {
          if (res.success) {
            myFuture.return({status: "success", data: res});
          } else {
            myFuture.return({status: "error", msg: res.message});
          }
        } else {
          myFuture.return({status: "error", msg: "Failed to create Payment Method."});
        }
      }
    });
    var result = myFuture.wait();

    return result;
  },
  'wtBraintreeAPIUpdatePaymentMethod': function (token, paymentMethodNonce, cardholderName) {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized");
    if (!Roles.userIsInRole(this.userId, ['domain-admin'])) throw new Meteor.Error(401, "Not authorized");

    var braintreeSettings = Meteor.call('wtBraintreeGetSettings');
    if (!braintreeSettings) {
      throw new Meteor.Error(401, "Failed to connect to Braintree.");
    }
    BraintreeAPI.connect(braintreeSettings.environment, braintreeSettings.merchantId, braintreeSettings.publicKey, braintreeSettings.privateKey);

    var myFuture = new Future();
    BraintreeAPI.updatePaymentMethod(token, paymentMethodNonce, cardholderName, function (err, res) {
      if (err) {
        myFuture.return({status: "error", msg: err.message});
      } else {
        if (res) {
          if (res.success) {
            myFuture.return({status: "success", data: res});
          } else {
            myFuture.return({status: "error", msg: res.message});
          }
        } else {
          myFuture.return({status: "error", msg: "Failed to update Payment Method."});
        }
      }
    });
    var result = myFuture.wait();

    return result;
  },
  'wtBraintreeAPICreateSubscription': function (paymentMethodToken, planId) {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized");
    if (!Roles.userIsInRole(this.userId, ['domain-admin'])) throw new Meteor.Error(401, "Not authorized");

    var braintreeSettings = Meteor.call('wtBraintreeGetSettings');
    if (!braintreeSettings) {
      throw new Meteor.Error(401, "Failed to connect to Braintree.");
    }
    BraintreeAPI.connect(braintreeSettings.environment, braintreeSettings.merchantId, braintreeSettings.publicKey, braintreeSettings.privateKey);

    var myFuture = new Future();
    BraintreeAPI.createSubscription(paymentMethodToken, planId, function (err, res) {
      if (err) {
        myFuture.return({status: "error", msg: err.message});
      } else {
        if (res) {
          if (res.success) {
            myFuture.return({status: "success", data: res});
          } else {
            myFuture.return({status: "error", msg: res.message});
          }
        } else {
          myFuture.return({status: "error", msg: "Failed to create new Subscription."});
        }
      }
    });
    var result = myFuture.wait();

    return result;
  }
});
