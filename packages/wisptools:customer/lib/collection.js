// Main collection that keeps every interaction.
WtCustomer = new Mongo.Collection('wt_customer');

WtCustomer.allow({
  insert: function(userId, doc) {
    // only allow posting if you are logged in
    return !! userId;
  },
  update: function(userId, doc) {
    return !! userId;
  }
});

// Takes an id of a WtInteraction and uses the name, phone and address to initialize a new customer
WtCustomer.newFromInteraction = function (id) {
  var user = Meteor.user();
  check(user.username, String);
  check(id, String);

  var data = WtInteraction.findOne({_id: id});

  var customer = {
    c_date: new Date(),
    c_user_id: user._id,
    c_user: user.username,
    acc_name: data.name,
    contacts: [{
      first_name: data.name,
      phones: [{phone: data.phone}]
    }]
  }

  customer._id = this.insert(customer);
  return customer;
}


schema = {};

schema.address = new SimpleSchema({
  street_1: {
    type: String,
    label: "Street Address One",
    max: 100,
    optional: true
  },
  street_2: {
    type: String,
    label: "Street Address Two",
    max: 100,
    optional: true
  },
  city: {
    type: String,
    label: "City",
    max: 50,
    optional: true
  },
  state: {
    type: String,
    label: "State",
    regEx: /^A[LKSZRAEP]|C[AOT]|D[EC]|F[LM]|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY]$/,
    optional: true
  },
  zip: {
    type: String,
    label: "Zip",
    regEx: /^[0-9]{5}$/,
    optional: true
  },
  geocode: {
      type: Object,
      optional: true
  }    

});

schema.email = new SimpleSchema({
  email: {
    type: String,
    label: "Email",
    max: 100,
    regEx: SimpleSchema.RegEx.Email,
    optional: true
  }
});

schema.phone = new SimpleSchema({
  phone: {
    type: Number,
    label: "Phone Number",
    optional: true
  },
  extention: {
    type: Number,
    label: "Extention",
    optional: true
  },
  type: {
    type: String,
    label: "Type",
    allowedValues: [
      'Home',
      'Work',
      'Cell'
    ],
    optional: true
  }
});

schema.contact = new SimpleSchema({
  first_name: {
    type: String,
    label: "First Name",
    max: 30,
    optional: true
  },
  last_name: {
    type: String,
    label: "Last Name",
    max: 30,
    optional: true
  },
  emails: {
    type: [schema.email],
    optional: true
  },
  phones: {
    type: [schema.phone],
    optional: true
  }
}); 

schema.customer = new SimpleSchema({
  acc_type: {
    type: String,
    allowedValues: [
      'Residential',
      'Business'
    ],
    optional: true
  },
  acc_name: {
    type: String,
    optional: true,
    max: 100
  },
  contacts: {
    type: [schema.contact],
    optional: true
  },
  phys_addr: {
    type: schema.address,
    optional: true
  },
  bill_addr: {
    type: schema.address,
    optional: true
  },
  external_ids: {
    type: [Object],
    optional: true
  },
  status: {
    type: String,
    allowedValues: [
      'New',
      'Scheduled',
      'Active',
      'Non Pay',
      'Hold',
      'Closed'
    ],
    optional: true
  }
});