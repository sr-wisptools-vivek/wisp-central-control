
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



