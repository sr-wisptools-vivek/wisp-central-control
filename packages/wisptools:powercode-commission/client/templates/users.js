
Template.wtPowercodeCommissionUsers.helpers({
  userList: function () {
    return Template.instance().userList.get();
  }
});

Template.wtPowercodeCommissionUsers.created = function () {
  var self = this;
  self.userList = new ReactiveVar([]);

  Meteor.call('wtPowercodeGetAllWebUsers', function (err, res) {
    if (err)
      console.log(err)
    else 
      self.userList.set(res);
  });

}

Template.wtPowercodeCommissionUsersComSelect.helpers({
  userType: function () {
    var webUser = Template.parentData(1);
    var data = WtPowercodeCommission.collection.user.findOne({webUserID: webUser.WebUserID});
    // init if not found
    if (data == undefined) {
      var webUsername = this.webUsername;
      data = {
        webUserID: webUser.WebUserID,
        webUsername: webUser.Username,
        commissionTypeId: "None",
        commissionTypeName: "None"
      }
      var id = WtPowercodeCommission.collection.user.insert(data);
      data._id = id;
    }
    return data;
  },
  typeList: function () {
    return WtPowercodeCommission.collection.type.find({deleted: {$ne: true}}).fetch();
  },
  selected: function (a, b) {
    return a == b ? 'selected' : '';
  }
});

Template.wtPowercodeCommissionUsersComSelect.events({
  "change .type-sel": function (event) {
    var webUser = Template.parentData(0);
    var userType = WtPowercodeCommission.collection.user.findOne({webUserID: webUser.WebUserID});
    var data = {
      webUserID: webUser.WebUserID,
      webUsername: webUser.Username,
      commissionTypeId: event.target.value,
      commissionTypeName: event.target[event.target.selectedIndex].text
    }
    WtPowercodeCommission.collection.user.update(userType._id, {$set: data}, {}, function (err, res) {
      if (err)
        WtGrowl.fail("Could not update commission type for user " + webUser.Username);
      else
        WtGrowl.success("Commission type updated for user " + webUser.Username);
    });
  }
});
