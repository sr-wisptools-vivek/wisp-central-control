// Main collection for the towers.
WtTower = new Mongo.Collection('wt_towers');

WtTower.allow({
  insert: function(userId, doc) {
    // only allow posting if you are logged in
    return !! userId;
  },
  update: function(userId, doc) {
    return !! userId;
  }
});
