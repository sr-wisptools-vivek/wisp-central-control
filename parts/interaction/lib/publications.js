wtInteraction = new Mongo.Collection('interation');

Meteor.publish('wtInteraction', function() {
  return wtInteraction.find();
});