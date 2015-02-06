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

schema = {};

schema.address = new SimpleSchema({
  street_1: {
    type: String,
    label: "Street Address One"
    max: 100
  },
  street_2: {
    type: String,
    label: "Street Address Two"
    max: 100
  },
  city: {
    type: String,
    label: "City",
    max: 50
  },
  state: {
    type: String,
    label: "State",
    regEx: /^A[LKSZRAEP]|C[AOT]|D[EC]|F[LM]|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY]$/
  },
  zip: {
    type: String,
    label: "Zip"
    regEx: /^[0-9]{5}$/
  }
});

schema.email = new SimpleSchema({
  email: {
    type: String,
    lable: "Email",
    max: 100,
    regEx: SimpleSchema.RegEx.Email
  }
});

schema.phone = new SimpleSchema({
  phone: {
    type: Number,
    label: "Phone Number"
  },
  extention: {
    type: Number,
    label: "Extention"
  },
  type: {
    type: String,
    label: "Type",
    allowedValues: [
      'Home',
      'Work',
      'Cell'
    ]
  }
});

schema.contact = new SimpleSchema({
  first_name: {
    type: String,
    label: "First Name",
    max: 30
  },
  last_name: {
    type: String,
    label: "Last Name",
    max: 30
  },
  emails: {
    type: [schema.email]
  },
  phones: {
    type: [schema.phone]
  }
}); 

schema.customer = new SimpleSchema({
  acc_type: {
    type: String,
    allowedValues: [
      'Residential',
      'Business'
    ],
    optional: false
  },
  acc_name: {
    type: String,
    optional: false,
    max: 100
  },
  contacts: {
    type: [schema.contact]
  }
  phys_addr: {
    type: schema.address
  },
  bill_addr: {
    type: schema.address
  },
  geocode: {
    type: Object
  },
  external_ids: {
    type: [Object]
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
    ]
  }
});