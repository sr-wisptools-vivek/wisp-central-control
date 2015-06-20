Template.wtPowercodeExteNetAPI.helpers({
  config: function () {
    var data = WtPowercodeExtenet.collection.api.findOne();
    if (data === undefined) {
      data = {
        url: "",
        username: "",
        password: "",
        webuser: "",
        profile: ""
      }
    }
    return data;
  },
  webusers: function () {
    return Template.instance().webUsers.get();
  }
});

Template.wtPowercodeExteNetAPIWebUsersOption.helpers({
  webuser: function () {
    var data = WtPowercodeExtenet.collection.api.findOne();
    if (data === undefined) {
      data.webuser = '';
    }
    return data.webuser;
  },
  selected: function (a, b) {
    return a == b ? 'selected' : '';
  }
});

Template.wtPowercodeExteNetAPI.created = function () {
  var self = this;
  // Initialize the reactive var to and empty array
  self.webUsers = new ReactiveVar([]);

  // Make a Meteor.method call and update the reactive var to the data from the result
  Meteor.call('wtPowercodeGetAllWebUsers', function (err, res) {
    if (err)
      console.log(err)
    else {
      self.webUsers.set(res);
    }
  });

}

Template.wtPowercodeExteNetAPI.events({
  "submit .save-mnet-api": function (event) {
    event.preventDefault();

    var _id = this._id
    var data = {
      url: event.target.url.value,
      username: event.target.username.value,
      password: event.target.password.value,
      webuser: event.target.webuser.value,
      profile: event.target.profile.value
    }

    // Check if we need to do the first time insert as we can only update a record by _id.
    if (this._id === undefined) {
      _id = WtPowercodeExtenet.collection.api.insert(data);
    }

    WtPowercodeExtenet.collection.api.update(_id, {$set: data}, {}, function (err, res) {
      if (err)
        WtGrowl.fail("Could not save mNet API settings");
      else
        WtGrowl.success("mNet API settings saved");
    });

  }
});