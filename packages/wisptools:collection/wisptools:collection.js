subsManager = new SubsManager();

WtCollection = function(collectionName) {

  // Create new collection
  var wtCollection = new Mongo.Collection(collectionName);

  // Set basic permissions
  // TODO: Add better access control
  wtCollection.allow({
    insert: function(userId, doc) {
      return !! userId;
    },
    update: function(userId, doc) {
      return !! userId;
    }
  });

  if (Meteor.isServer) {
    Meteor.publish(collectionName, function() {
      return wtCollection.find();
    });
  }

  if (Meteor.isClient) {
    subsManager.subscribe(collectionName);
  }

  // Not really using this at the moment, because AutoForm is doing the updates.
  wtCollection.updateFeild = function (id, data) {
    this.update({_id: id}, {$set: data});
  }

  return wtCollection;

};