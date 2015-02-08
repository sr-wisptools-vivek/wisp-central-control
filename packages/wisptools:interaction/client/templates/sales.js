var pageData = [
  {
    name: "Inital Questions",
    pageId: "initial_questions_page",
    schema: new SimpleSchema({
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
    })
  },{
    name: "Service Address",
    pageId: "service_address_page",
    schema: new SimpleSchema({
      address: {
        type: String,
        label: "What is the Address where you would like to have the Service at?",
        max: 100,
        optional: true
      },
      agl: {
        type: Number,
        label: "Height of SM at Location (ft):",
        defaultValue: 15,
        optional: true
      }
    })
  },{
    name: "More Questions",
    pageId: "more_questions_page",
    schema: new SimpleSchema({
      cur_provider: {
        type: String,
        label: "Who is your current internet provider?",
        allowedValues: [
          'Comcast',
          'CentryLink',
          'AT&T',
          'Dial Up',
          'None',
          'Other'
        ],
        optional: true
      },
      cur_satisfaction: {
        type: String,
        label: "How is your current provider working for you?",
        allowedValues: [
          'Very Happy',
          'Satisfied',
          'Unstatisfied',
          'Frustrated'
        ],
        optional: true
      },
      cur_cost: {
        type: String,
        label: "How much did they charge you?",
        allowedValues: [
          '$10.00',
          '$15.00',
          '$20.00',
          '$25.00',
          '$30.00',
          '$35.00',
          '$40.00',
          '$45.00',
          '$50.00',
          '$55.00',
          '$60.00',
          '$65.00',
          '$70.00',
          '$75.00',
          '$80.00',
          '$85.00',
          '$90.00',
          '$95.00',
          '$100.00+'
        ],
        optional: true
      },
      why_shopping: {
        type: String,
        label: "What led you to look for new internet?",
        allowedValues: [
          'Moved Into Area',
          'Need Faster Speed',
          'Save Money',
          'Bandwidth Cap/Limit',
          'Other'
        ],
        optional: true
      }
    })
  },{
    name: "Choose A Plan",
    pageId: "choose_a_plan_page",
    showCustomerConversion: true,
    schema: new SimpleSchema({
      plan: {
        type: String,
        label: "Working on this page.  Need to build a package that links into the plan collection.",
        max: 30,
        optional: true
      }
    })
  },{
    name: "Disclosures",
    pageId: "disclosures_page",
    schema: new SimpleSchema({
      disclosure1: {
        type: Boolean,
        label: "Someone 18 years or older must be present.",
        max: 30,
        optional: true
      }
    })
  }
];

Template.wtInteractionSales.helpers({
  pages: pageData
});

Template.wtInteractionSales.events({
  'click #convert': function(e) {
    $('#convert').prop('disabled', true);
    var interaction = Template.parentData(2);
    var customer = WtCustomer.newFromInteraction(interaction.data._id);
    WtInteraction.updateFeild(interaction.data._id, {customerId: customer._id});
  }
});

