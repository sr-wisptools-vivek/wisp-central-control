schema = {};

schema.sales = new SimpleSchema({
  regarding: {
    type: String,
    label: "How can I help you today?",
    allowedValues: [
      'Want to Upgrade Service', 
      'Checking Prices',
      'To Sign Up',
      'Outside Sales Agent',
      'Not a Sales Call',
      'Other'
    ],
    optional: true
  },
  name: {
    type: String,
    label: "So that I know who I'm talking with, what is your First Name please?",
    max: 60,
    optional: true
  },
  phone: {
    type: Number,
    label: "In case we get disconnected what is the best number I can call you back on?",
    optional: true
  },
  heard_about: {
    type: String,
    label: "How did you hear about us?",
    allowedValues: [
      'Billboard',
      'Radio',
      'Mailer',
      'Friend',
      'Outside Sales',
      'Coupon Mailer',
      'Other'
    ],
    optional: true
  }
});

