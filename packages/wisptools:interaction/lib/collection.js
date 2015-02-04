// Main collection that keeps every interaction.
WtInteraction = new Mongo.Collection('wt_interactions');

WtInteraction.allow({
  insert: function(userId, doc) {
    // only allow posting if you are logged in
    return !! userId;
  },
  update: function(userId, doc) {
    return !! userId;
  }
});

// This is called when a new interaction is created.
// It initializes the record and returns the id.
WtInteraction.new = function (data) {
  var user = Meteor.user();
  check(user.username, String);
  check(data, {type: String});

    var interaction = _.extend(data, {
        c_date: new Date(),
        c_user_id: user._id,
        c_user: user.username        
    });
    interaction._id = this.insert(interaction);
    return interaction;

}

// Not really using this at the moment, because AutoForm is doing the updates.
WtInteraction.updateFeild = function (id, data) {
  this.update({_id: id}, {$set: data});
}

// The collection that stores all the schema information.
// The admin can update this information to change the data on the pages.
WtInteractionConfig = new Mongo.Collection('wt_interactions_config');

