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
      WtBraintreeSettings.collection.update({owner: this.userId}, {
        publicKey: publicKey,
        privateKey: privateKey,
        environment: environment,
        merchantId: merchantId
      });
    } else {
      WtBraintreeSettings.collection.insert({
        publicKey: publicKey,
        privateKey: privateKey,
        environment: environment,
        merchantId: merchantId,
        owner: this.userId
      });
    }
  }
});
