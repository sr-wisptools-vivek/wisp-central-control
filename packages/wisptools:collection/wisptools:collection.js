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


  // This creates a new record in the collection, adding the create date and user.
  // Returns the newly created record.
  wtCollection.new =function (data) {
    var user = Meteor.user();
    check(user.username, String);
    check(data, {type: String});

      var extData = _.extend(data, {
          c_date: new Date(),
          c_user_id: user._id,
          c_user: user.username        
      });
      extData._id = this.insert(extData);
      return extData;
  },

  // Not really using this at the moment, because AutoForm is doing the updates.
  wtCollection.updateFeild = function (id, data) {
    this.update({_id: id}, {$set: data});
  }

  return wtCollection;

}; 

