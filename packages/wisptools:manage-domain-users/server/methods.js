Meteor.method('wtManageDomainUsersGetDomainUsers', function () {
  if (!this.userId) throw new Meteor.Error('denied','Not Authorized');
  if (!Roles.userIsInRole(this.userId, ['domain-admin'])) throw new Meteor.Error(401, "Not authorized");

  var domain = WtMangedRouterMySQLDomains.findOne({userId: this.userId});
  if (domain && domain.name) {
    var domainUsers = WtMangedRouterMySQLDomains.find({name: domain.name}).fetch();
    if (domainUsers && domainUsers.length>0) {
      var domainUserIds = [];
      for (var i=0; i<domainUsers.length; i++) {
        domainUserIds.push(domainUsers[i].userId);
      }
      if (domainUserIds && domainUserIds.length>0) {
        return Meteor.users.find({_id: {$in: domainUserIds}}).fetch();
      }
    }
  }
  return false;
});

Meteor.method('wtManageDomainUsersDisableUser', function (userId) {
  if (!this.userId) throw new Meteor.Error('denied','Not Authorized');
  if (!Roles.userIsInRole(this.userId, ['domain-admin'])) throw new Meteor.Error(401, "Not authorized");

  var domain = WtMangedRouterMySQLDomains.findOne({userId: this.userId});
  if (domain && domain.name) {
    var domainUser = WtMangedRouterMySQLDomains.findOne({userId: userId, name: domain.name});
    if (!domainUser) {
      throw new Meteor.Error("User not found or you are not authorized to modify this user.");
    } else {
      Meteor.users.update({_id: userId}, {$set: {"profile.disabled": true}});
      return true;
    }
  }
  return false;
});

Meteor.method('wtManageDomainUsersEnableUser', function (userId) {
  if (!this.userId) throw new Meteor.Error('denied','Not Authorized');
  if (!Roles.userIsInRole(this.userId, ['domain-admin'])) throw new Meteor.Error(401, "Not authorized");

  var domain = WtMangedRouterMySQLDomains.findOne({userId: this.userId});
  if (domain && domain.name) {
    var domainUser = WtMangedRouterMySQLDomains.findOne({userId: userId, name: domain.name});
    if (!domainUser) {
      throw new Meteor.Error("User not found or you are not authorized to modify this user.");
    } else {
      Meteor.users.update({_id: userId}, {$set: {"profile.disabled": false}});
      return true;
    }
  }
  return false;
});
