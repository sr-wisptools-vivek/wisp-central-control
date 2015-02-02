
// The config needs to be initialized
if (WtInteractionConfig.find().count() === 0) {
  console.log("Initializing the wt_interaction_config collection...");

  // Only have on "menu"
  WtInteractionConfig.insert({
    type: "menu",
    text: "New Interaction",
    icon_class: "fa fa-users"
  });

  // Sales Interaction
  WtInteractionConfig.insert({
    type: "dropdown",
    text: "Sales",
    name: "sales",
    icon_class: "fa fa-usd",
    display_order: 1
  });

  // Support Interaction
  WtInteractionConfig.insert({
    type: "dropdown",
    text: "Support",
    name: "support",
    icon_class: "fa fa-wrench",
    display_order: 2,
  });

  // Customer Service Interaction
  WtInteractionConfig.insert({
    type: "dropdown",
    text: "Customer Service",
    name: "service",
    icon_class: "fa fa-user",
    display_order: 3,
  });

  // The schema builds the page form using AutoForm
  WtInteractionConfig.insert({
    type: "schema",
    page: "sales",
    name: "Inital Questions",
    display_order: 1,
    schema: {
      regarding: {
        type: "String",
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
        type: "String",
        label: "So that I know who I'm talking with, what is your First Name please?",
        max: 60,
        optional: true
      },
      phone: {
        type: "Number",
        label: "In case we get disconnected what is the best number I can call you back on?",
        optional: true
      },
      heard_about: {
        type: "String",
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
    }
  });

  WtInteractionConfig.insert({
    type: "schema",
    page: "sales",
    name: "Service Address",
    display_order: 2,
    schema: {
      address: {
        type: "String",
        label: "What is the Address where you would like to have the Service at?",
        max: 100,
        optional: false
      },
      agl: {
        type: "Number",
        label: "Height of SM at Location (ft):",
        defaultValue: 15,
        optional: false
      }
    }
  });

  WtInteractionConfig.insert({
    type: "schema",
    page: "sales",
    name: "More Questions",
    display_order: 3,
    schema: {
      cur_provider: {
        type: "String",
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
        type: "String",
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
        type: "String",
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
        type: "String",
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
    }
  });

  WtInteractionConfig.insert({
    type: "schema",
    page: "sales",
    name: "Choose A Plan",
    display_order: 4,
    schema: {
      plan: {
        type: "String",
        label: "Working on this page.  Need to build a package that links into the plan collection.",
        max: 30,
        optional: true
      }
    }
  });

  WtInteractionConfig.insert({
    type: "schema",
    page: "sales",
    name: "Disclosures",
    display_order: 5,
    schema: {
      disclosure1: {
        type: "Boolean",
        label: "Someone 18 years or older must be present.",
        max: 30,
        optional: true
      }
    }
  });

  WtInteractionConfig.insert({
    type: "schema",
    page: "support",
    name: "Support Questions One",
    display_order: 1,
    schema: {
      placeholder: {
        type: "String",
        label: "Question One:",
        max: 30,
        optional: true
      }
    }
  });

  WtInteractionConfig.insert({
    type: "schema",
    page: "support",
    name: "Support Questions Two",
    display_order: 2,
    schema: {
      placeholder: {
        type: "String",
        label: "Question Two:",
        max: 30,
        optional: true
      }
    }
  });

  WtInteractionConfig.insert({
    type: "schema",
    page: "service",
    name: "Service Questions One",
    display_order: 1,
    schema: {
      placeholder: {
        type: "String",
        label: "Question One:",
        max: 30,
        optional: true
      }
    }
  });

  WtInteractionConfig.insert({
    type: "schema",
    page: "service",
    name: "Service Questions Two",
    display_order: 2,
    schema: {
      placeholder: {
        type: "String",
        label: "Question Two:",
        max: 30,
        optional: true
      }
    }
  });


}