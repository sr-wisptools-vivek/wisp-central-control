
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
    template: "wtInteractionSales",
    display_order: 1
  });

  // Support Interaction
  WtInteractionConfig.insert({
    type: "dropdown",
    text: "Support",
    name: "support",
    icon_class: "fa fa-wrench",
    template: "wtInteractionSupport",
    display_order: 2
  });

  // Customer Service Interaction
  WtInteractionConfig.insert({
    type: "dropdown",
    text: "Customer Service",
    name: "service",
    icon_class: "fa fa-user",
    template: "wtInteractionService",
    display_order: 3
  });

}