Meteor.publish('wtInteractions', function() {
  return WtInteraction.find();
});

Meteor.publish('wtInteractionsConfig', function() {
  return WtInteractionConfig.find();
});
