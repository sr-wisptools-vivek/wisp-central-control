var pageData = [
  {
    tabName: "Contact",
    tabId: "contact_page",
    tabTemplate: "wtInteractionQuickForm",
    schema: new SimpleSchema({
      regarding: {
        type: String,
        label: "How can I help you today?",
        optional: true,
        autoform: {
          afFieldInput: {
            type: "select-other",
            options: [
              'Want to Upgrade Service', 
              'Checking Prices',
              'To Sign Up',
              'Outside Sales Agent',
              'Not a Sales Call'
            ]
          }
        }

      },
      name: {
        type: String,
        label: "So that I know who I'm talking with, what is your First Name please?",
        max: 60,
        optional: true
      },
      phone: {
        type: String,
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
    tabName: "Location",
    tabId: "location_page",
    tabTemplate: "wtInteractionQuickForm",
    schema: new SimpleSchema({
      address: {
        type: String,
        label: "What is the Address where you would like to have the Service at?",
        max: 100,
        optional: true
      },
      bld_stories: {
        type: Number,
        label: "How many stories tall is your building?",
        defaultValue: 2,
        optional: true
      }
    })
  },{
    tabName: "Questions",
    tabId: "questions_page",
    tabTemplate: "wtInteractionSalesQuestions",
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
    tabName: "Plans",
    tabId: "plan_page",
    tabTemplate: "wtInteractionQuickForm",
    schema: new SimpleSchema({
      plan: {
        type: String,
        label: "Working on this page.  Need to build a package that links into the plan collection.",
        max: 30,
        optional: true
      }
    })
  },{
    tabName: "Schedule",
    tabId: "schedule_page",
    tabTemplate: "wtInteractionQuickForm",
    schema: new SimpleSchema({
      schedule: {
        type: String,
        label: "Working on this page.  Need to build a package that handles the schedule.",
        max: 30,
        optional: true
      }
    })
  },{
    tabName: "Order",
    tabId: "order_page",
    tabTemplate: "wtInteractionSalesOrder",
    schema: new SimpleSchema({
    })
  },{
    tabName: "Disclosures",
    tabId: "disclosures_page",
    tabTemplate: "wtInteractionQuickForm",
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
  pages: function () {
    // Setting the parent interaction data, so each page as access to the main context.
    for (i = 0; i < pageData.length; i++) {
      pageData[i].interactionData = Template.parentData(2).data;
    }
    return pageData;
  },
  interactionId: function () {
    return Template.parentData(2).data._id;
  },
  customerId: function () {
    return Template.parentData(2).data.customerId;
  }
});

Template.wtInteractionSales.events({
  'click #convert': function(e) {
    $('#convert').prop('disabled', true);
    var interaction = Template.parentData(2);
    var customer = WtCustomer.newFromInteraction(interaction.data._id);
    WtInteraction.updateFeild(interaction.data._id, {customerId: customer._id});
  }
});

Template.wtInteractionSalesOrder.helpers({
  formId: function () {
    return this.tabId + "_form";    
  }
});


Template.wtInteractionSalesQuestions.helpers({
  formId: function () {
    return this.tabId + "_form";    
  }
});
