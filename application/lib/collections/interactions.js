Interactions = new Mongo.Collection('interaction');

Interactions.allow({
  insert: function(userId, doc) {
    // only allow posting if you are logged in
    return !! userId;
  }
});