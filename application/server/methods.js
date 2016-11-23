Meteor.methods({
  fixAccountLoginType: function () {
    if (!this.userId || !Roles.userIsInRole(this.userId, ['admin'])) throw new Meteor.Error('denied','Not Authorized');

    var users = Meteor.users.find({"emails": {"$exists": false}});
    users.forEach(function (row) {
      if (isValidEmail(row.username)) {
        Meteor.users.update({_id: row._id}, {$push: {"emails": {
          "address": row.username,
          "verified": false
        }}});
      }
    });
  }
});


var isValidEmail = function (email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(email)) {
    return true;
  }
  return false;
};
