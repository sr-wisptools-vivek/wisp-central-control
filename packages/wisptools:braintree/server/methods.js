Meteor.methods({
  'wtBraintreeGetSettings': function () {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized");
    if (!Roles.userIsInRole(this.userId, ['domain-admin', 'customer'])) throw new Meteor.Error(401, "Not authorized");

    var domainId = Meteor.call('wtManagedRouterMySQLGetMyDomainId');
    var braintreeSettings = WtBraintreeSettings.collection.findOne({domainId: domainId});
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

    var domainId = Meteor.call('wtManagedRouterMySQLGetMyDomainId');
    var braintreeSettings = WtBraintreeSettings.collection.findOne({domainId: domainId});
    if (braintreeSettings) {
      WtBraintreeSettings.collection.update({domainId: domainId}, {$set: {
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
        merchantId: merchantId
      });
    }
  },
  'wtBraintreeAPIAddCustomer': function (firstName, lastName, companyname, phone, email, address, city, state, zip) {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized");
    if (!Roles.userIsInRole(this.userId, ['domain-admin', 'customer'])) throw new Meteor.Error(401, "Not authorized");

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
    if (!Roles.userIsInRole(this.userId, ['domain-admin', 'customer'])) throw new Meteor.Error(401, "Not authorized");

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
    if (!Roles.userIsInRole(this.userId, ['domain-admin', 'customer'])) throw new Meteor.Error(401, "Not authorized");

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
    if (!Roles.userIsInRole(this.userId, ['domain-admin', 'customer'])) throw new Meteor.Error(401, "Not authorized");

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
    if (!Roles.userIsInRole(this.userId, ['domain-admin', 'customer'])) throw new Meteor.Error(401, "Not authorized");

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
    if (!Roles.userIsInRole(this.userId, ['domain-admin', 'customer'])) throw new Meteor.Error(401, "Not authorized");

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
    if (!Roles.userIsInRole(this.userId, ['domain-admin', 'customer'])) throw new Meteor.Error(401, "Not authorized");

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
  'wtBraintreeAPICreateSubscription': function (paymentMethodToken, planId, addonList, discountList) {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized");
    if (!Roles.userIsInRole(this.userId, ['domain-admin', 'customer'])) throw new Meteor.Error(401, "Not authorized");

    var braintreeSettings = Meteor.call('wtBraintreeGetSettings');
    if (!braintreeSettings) {
      throw new Meteor.Error(401, "Failed to connect to Braintree.");
    }
    BraintreeAPI.connect(braintreeSettings.environment, braintreeSettings.merchantId, braintreeSettings.publicKey, braintreeSettings.privateKey);

    var addons = {};
    if (addonList.length>0) {
      addons = {add: []};
      for (i in addonList) {
        addons.add.push({inheritedFromId: addonList[i]});
      }
    }
    var discounts = {};
    if (discountList.length>0) {
      discounts = {add: []};
      for (i in discountList) {
        discounts.add.push({inheritedFromId: discountList[i]});
      }
    }

    var myFuture = new Future();
    BraintreeAPI.createSubscription(paymentMethodToken, planId, addons, discounts, function (err, res) {
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
  },
  'wtBraintreeAPICancelSubscription': function (subscriptionId) {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized");
    if (!Roles.userIsInRole(this.userId, ['domain-admin', 'customer'])) throw new Meteor.Error(401, "Not authorized");

    var braintreeSettings = Meteor.call('wtBraintreeGetSettings');
    if (!braintreeSettings) {
      throw new Meteor.Error(401, "Failed to connect to Braintree.");
    }
    BraintreeAPI.connect(braintreeSettings.environment, braintreeSettings.merchantId, braintreeSettings.publicKey, braintreeSettings.privateKey);

    var myFuture = new Future();
    BraintreeAPI.cancelSubscription(subscriptionId, function (err, res) {
      if (err) {
        myFuture.return({status: "error", msg: err.message});
      } else {
        if (res) {
          if (res.success) {
            myFuture.return({status: "success", data: res});
          } else {
            myFuture.return({status: "error", msg: res.msg});
          }
        } else {
          myFuture.return({status: "error", msg: "Failed to cancel Subscription."});
        }
      }
    });
    var result = myFuture.wait();

    return result;
  },
  'wtBraintreeAPIGetAddons': function () {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized");
    if (!Roles.userIsInRole(this.userId, ['domain-admin', 'customer'])) throw new Meteor.Error(401, "Not authorized");

    var braintreeSettings = Meteor.call('wtBraintreeGetSettings');
    if (!braintreeSettings) {
      throw new Meteor.Error(401, "Failed to connect to Braintree.");
    }
    BraintreeAPI.connect(braintreeSettings.environment, braintreeSettings.merchantId, braintreeSettings.publicKey, braintreeSettings.privateKey);

    var myFuture = new Future();
    BraintreeAPI.getAddons(function (err, res) {
      if (err) {
        myFuture.return({status: "error", msg: err.message});
      } else {
        if (res && res.success) {
          myFuture.return({status: "success", data: res.addOns});
        } else {
          myFuture.return({status: "error", msg: "No AddOns found"});
        }
      }
    });
    var result = myFuture.wait();

    return result.data;
  },
  'wtBraintreeAPIGetDiscounts': function () {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized");
    if (!Roles.userIsInRole(this.userId, ['domain-admin', 'customer'])) throw new Meteor.Error(401, "Not authorized");

    var braintreeSettings = Meteor.call('wtBraintreeGetSettings');
    if (!braintreeSettings) {
      throw new Meteor.Error(401, "Failed to connect to Braintree.");
    }
    BraintreeAPI.connect(braintreeSettings.environment, braintreeSettings.merchantId, braintreeSettings.publicKey, braintreeSettings.privateKey);

    var myFuture = new Future();
    BraintreeAPI.getDiscounts(function (err, res) {
      if (err) {
        myFuture.return({status: "error", msg: err.message});
      } else {
        if (res && res.success) {
          myFuture.return({status: "success", data: res.discounts});
        } else {
          myFuture.return({status: "error", msg: "No Discounts found"});
        }
      }
    });
    var result = myFuture.wait();

    return result.data;
  },
  'wtBraintreeAPICreateSaleTransaction': function (paymentMethodToken, amount) {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized");
    if (!Roles.userIsInRole(this.userId, ['domain-admin', 'customer'])) throw new Meteor.Error(401, "Not authorized");

    var braintreeSettings = Meteor.call('wtBraintreeGetSettings');
    if (!braintreeSettings) {
      throw new Meteor.Error(401, "Failed to connect to Braintree.");
    }
    BraintreeAPI.connect(braintreeSettings.environment, braintreeSettings.merchantId, braintreeSettings.publicKey, braintreeSettings.privateKey);

    var myFuture = new Future();
    BraintreeAPI.createSaleTransaction(paymentMethodToken, amount, function (err, res) {
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
          myFuture.return({status: "error", msg: "Failed to create new Sale transaction."});
        }
      }
    });
    var result = myFuture.wait();

    return result;
  },
  'wtBraintreeAPISearchTransactions': function (customerId) {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized");
    if (!Roles.userIsInRole(this.userId, ['domain-admin', 'customer'])) throw new Meteor.Error(401, "Not authorized");

    var braintreeSettings = Meteor.call('wtBraintreeGetSettings');
    if (!braintreeSettings) {
      throw new Meteor.Error(401, "Failed to connect to Braintree.");
    }
    BraintreeAPI.connect(braintreeSettings.environment, braintreeSettings.merchantId, braintreeSettings.publicKey, braintreeSettings.privateKey);

    var myFuture = new Future();
    BraintreeAPI.searchTransactions(customerId, Meteor.bindEnvironment(function (err, res) {
      if (err) {
        myFuture.return({status: "error", msg: err.message});
      } else {
        if (res) {
          var transactions = [];
          var myFuture1 = new Future();
          res.each(function (err, transaction) {
            transactions.push(transaction);
            if (transactions.length >= res.ids.length) {
              myFuture1.return(true);
            }
          });
          myFuture1.wait();
          myFuture.return({status: "success", data: transactions});
        } else {
          myFuture.return({status: "error", msg: "Failed to search transactions."});
        }
      }
    }));
    var result = myFuture.wait();

    return result;
  }
});
