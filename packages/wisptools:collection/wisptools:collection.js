subsManager = new SubsManager();

WtCollection = function(collectionName) {

  // Create new collection
  wtCollection = new Mongo.Collection(collectionName);

  // Set basic permissions
  wtCollection.allow({
    insert: function(userId, doc) {
      // only allow posting if you are logged in
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

