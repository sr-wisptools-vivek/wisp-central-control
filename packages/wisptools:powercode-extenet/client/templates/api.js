Template.wtPowercodeExteNetAPI.helpers({
  config: function () {
    var data = WtPowercodeExtenet.collection.api.findOne();
    if (data === undefined) {
      data = {
        url: "",
        username: "",
        password: ""
      }
    }
    return data;
  }
});



Template.wtPowercodeExteNetAPI.events({
  "submit .save-mnet-api": function (event) {
    event.preventDefault();

    var _id = this._id
    var data = {
      url: event.target.url.value,
      username: event.target.username.value,
      password: event.target.password.value
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