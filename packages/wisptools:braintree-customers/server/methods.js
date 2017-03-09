Meteor.methods({
  'wtBraintreeCustomerAddCustomer': function (customerId, addressId, firstName, lastName, companyname, phone, email, address, city, state, zip) {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized");
    if (!Roles.userIsInRole(this.userId, ['domain-admin', 'customer'])) throw new Meteor.Error(401, "Not authorized");

    return WtBraintreeCustomers.collection.insert({
      customerId: customerId,
      addressId: addressId,
      firstName: firstName,
      lastName: lastName,
      company: companyname,
      phone: phone,
      email: email,
      address: address,
      city: city,
      state: state,
      zip: zip,
      domain: Meteor.call('wtManagedRouterMySQLGetMyDomain'),
      owner: this.userId
    });
  },
  'wtBraintreeCustomerUpdateCustomer': function (id, firstName, lastName, companyname, phone, email, address, city, state, zip) {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized");
    if (!Roles.userIsInRole(this.userId, ['domain-admin', 'customer'])) throw new Meteor.Error(401, "Not authorized");

    return WtBraintreeCustomers.collection.update({_id: id}, {$set: {
      firstName: firstName,
      lastName: lastName,
      company: companyname,
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
    if (!Roles.userIsInRole(this.userId, ['domain-admin', 'customer'])) throw new Meteor.Error(401, "Not authorized");

    if (!count) {
      count = 10;
    }

    if (!query || (query && query.length==0)) {
      return WtBraintreeCustomers.collection.find(
        {domain: Meteor.call('wtManagedRouterMySQLGetMyDomain')},
        {sort: {createdAt: -1}, limit: count}
      ).fetch();
    } else {
      var limitQuery = {limit: count};
      var re = new RegExp(query, 'i');
      var crit = {
        domain: Meteor.call('wtManagedRouterMySQLGetMyDomain'),
        $or: [
          {'customerId': re},
          {'firstName': re},
          {'lastName': re},
          {'company': re},
          {'phone': re},
          {'email': re}
        ]
      };
      return WtBraintreeCustomers.collection.find(crit, limitQuery).fetch();
    }
  },
  'wtBraintreeCustomerGetCustomer': function (id) {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized");
    if (!Roles.userIsInRole(this.userId, ['domain-admin', 'customer'])) throw new Meteor.Error(401, "Not authorized");

    return WtBraintreeCustomers.collection.findOne({
      _id: id,
      domain: Meteor.call('wtManagedRouterMySQLGetMyDomain')
    });
  }
});
