Meteor.publish('wtCustomer', function() {
  return WtCustomer.find();
});
