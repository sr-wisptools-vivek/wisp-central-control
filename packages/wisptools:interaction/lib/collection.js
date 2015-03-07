WtInteraction = new WtCollection('wt_interactions');

// This creates a new record in the collection, adding the create date and user.
// Returns the newly created record.
// Type is: sales, support, service
WtInteraction.new =function (data) {
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
}
