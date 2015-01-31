Meteor.publish('wtInteractions', function() {
  return WtInteraction.find();
});
