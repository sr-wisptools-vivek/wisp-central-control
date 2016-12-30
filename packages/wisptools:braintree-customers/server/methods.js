Meteor.methods({
  'wtBraintreeCustomerAddCustomer': function (customerId, firstName, lastName, phone, email, address, city, state, zip) {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized");
    if (!Roles.userIsInRole(this.userId, ['domain-admin'])) throw new Meteor.Error(401, "Not authorized");

    WtBraintreeCustomers.collection.insert({
      customerId: customerId,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      email: email,
      address: address,
      city: city,
      state: state,
      zip: zip,
      domain: Meteor.user().profile.domain,
      owner: this.userId
    });
  },
  'wtBraintreeCustomerGetCustomers': function (count) {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized");
    if (!Roles.userIsInRole(this.userId, ['domain-admin'])) throw new Meteor.Error(401, "Not authorized");

    return WtBraintreeCustomers.collection.find(
      {owner: this.userId, domain: Meteor.user().profile.domain},
      {sort: {createdAt: -1}, limit: count}
    ).fetch();
  }
});
