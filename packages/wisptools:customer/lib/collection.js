// Main collection that keeps every interaction.
WtCustomer = new WtCollection('wt_customer');

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
    first_name: data.name,
    phone: data.phone,
    address: {use_service_addr: true},
    status: "New"
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
    type: String,
    label: "Phone",
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
  first_name: {
    type: String,
    label: "First Name",
    optional: true,
    max: 100
  },
  last_name: {
    type: String,
    label: "Last Name",
    optional: true,
    max: 100
  },
  biz_name: {
    type: String,
    label: "Business Name (Optional)",
    optional: true,
    max: 100
  },
  phone: {
    type: String,
    label: "Phone",
    optional: true
  },
  email: {
    type: String,
    label: "Email",
    max: 100,
    regEx: SimpleSchema.RegEx.Email,
    optional: true
  },
  address: {
    type: Object,
    label: "Mailing Address"
  },
  'address.use_service_addr': {
    type: Boolean,
    label: "Use Service Address",
    optional: false
  },
  'address.street_1': {
    type: String,
    label: "Address One",
    max: 100,
    optional: true
  },
  'address.street_2': {
    type: String,
    label: "Address Two",
    max: 100,
    optional: true
  },
  'address.city': {
    type: String,
    label: "City",
    max: 50,
    optional: true
  },
  'address.state': {
    type: String,
    allowedValues: ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"],
    autoform: {
      afFieldInput: {
        firstOption: "(Select a State)"
      }
    },
    optional: true
  },
  'address.zip': {
    type: String,
    label: "Zip",
    regEx: /^[0-9]{5}$/,
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