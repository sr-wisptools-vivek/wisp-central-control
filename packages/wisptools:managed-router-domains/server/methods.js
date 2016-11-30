Meteor.method("wtManagedRouterDeleteDomain", function(){
  var removeDomain = Session.get('managedRouterDomainDelete');
  //check if domain is assigned to any user.
  var item = WtMangedRouterMySQLDomains.findOne({name: removeDomain.domain});
  if (item) {
    Session.set('managedRouterDomainDelete', null);
    throw new Meteor.Error('denied','Domain Assigned to User');    
  } else {
    WtMangedRouterMySQLDomainsList.remove({_id: removeDomain._id});
  }
});

Meteor.method("wtManagedRouterCheckDomain", function (domain) {
  if (domain && domain.trim().length>0 && domain.trim().indexOf(" ")==-1) {
    var domainList = WtMangedRouterMySQLDomainsList.findOne({domain: domain});
    if (!domainList) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
});