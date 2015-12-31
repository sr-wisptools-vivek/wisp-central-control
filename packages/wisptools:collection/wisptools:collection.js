subsManager = new SubsManager();

WtCollection = function(collectionName, allow) {

  // Create new collection
  var wtCollection = new Mongo.Collection(collectionName);
  var wtAllow = allow || function() {return !! this.userId;}; // default allow only logged in users

  // Set basic permissions
  // TODO: Add better access control
  wtCollection.allow({
    insert: function(userId, doc) {
      var context = {};
      context.userId = userId;
      context.doc = doc;
      return wtAllow.call(context, 'insert');
    },
    update: function(userId, doc) {
      var context = {};
      context.userId = userId;
      context.doc = doc;
      return wtAllow.call(context, 'update');
    }
  });

  if (Meteor.isServer) {
    Meteor.publish(collectionName, function() {
      if (!wtAllow.call(this, 'publish')) return null;
      // TODO: publish a smaller set of data...
      return wtCollection.find();
    });

    wtCollection.before.insert(function(userId, doc) {
      doc.createdAt = new Date();
    });

    wtCollection.before.update(function(userId, doc, fieldNames, modifier, options) {
      modifier.$set = modifier.$set || {};
      modifier.$set.updatedAt = new Date();
    });
  }

  if (Meteor.isClient) {
    subsManager.subscribe(collectionName);
  }

  return wtCollection;

};