Meteor.method('wtManageUserDomainsGetDomainUsers', function () {
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
