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
  'wtBraintreeCustomerUpdateCustomer': function (id, firstName, lastName, phone, email, address, city, state, zip) {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized");
    if (!Roles.userIsInRole(this.userId, ['domain-admin'])) throw new Meteor.Error(401, "Not authorized");

    WtBraintreeCustomers.collection.update({_id: id}, {$set: {
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      email: email,
      address: address,
      city: city,
      state: state,
      zip: zip
    }});
  },
  'wtBraintreeCustomerGetCustomers': function (count, query) {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized");
    if (!Roles.userIsInRole(this.userId, ['domain-admin'])) throw new Meteor.Error(401, "Not authorized");

    if (!count) {
      count = 10;
    }

    if (!query || (query && query.length==0)) {
      return WtBraintreeCustomers.collection.find(
        {owner: this.userId, domain: Meteor.user().profile.domain},
        {sort: {createdAt: -1}, limit: count}
      ).fetch();
    } else {
      var limitQuery = {limit: count};
      var re = new RegExp(query, 'i');
      var crit = {
        owner: this.userId,
        domain: Meteor.user().profile.domain,
        $or: [
          {'customerId': re},
          {'firstName': re},
          {'lastName': re},
          {'phone': re},
          {'email': re}
        ]
      };
      return WtBraintreeCustomers.collection.find(crit, limitQuery).fetch();
    }
  },
  'wtBraintreeCustomerGetCustomer': function (id) {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized");
    if (!Roles.userIsInRole(this.userId, ['domain-admin'])) throw new Meteor.Error(401, "Not authorized");

    return WtBraintreeCustomers.collection.findOne({
      _id: id,
      owner: this.userId,
      domain: Meteor.user().profile.domain
    });
  }
});
