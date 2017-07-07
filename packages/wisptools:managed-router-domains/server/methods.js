Meteor.method("wtManagedRouterDeleteDomain", function(){
  throw new Meteor.Error('denied','Delete domain is broken.');
  /***

  THIS NEEDS TO BE RE-WORKED!

  var removeDomain = Session.get('managedRouterDomainDelete');
  //check if domain is assigned to any user.
  var item = WtMangedRouterMySQLDomains.findOne({name: removeDomain.domain});
  if (item) {
    Session.set('managedRouterDomainDelete', null);
    throw new Meteor.Error('denied','Domain Assigned to User');
  } else {
    WtMangedRouterMySQLDomainsList.remove({_id: removeDomain._id});
  }
  ***/
});

Meteor.method("wtManagedRouterAddDomain", function (domain) {
  if (!this.userId) throw new Meteor.Error('denied','Not Authorized');
  // Only add new domain, if there isn't one already.
  if (domain && domain.trim().length>0 && domain.trim().indexOf(" ")==-1) {
    domain = domain.trim();
    var domainList = WtMangedRouterMySQLDomainsList.findOne({domain: new RegExp("^"+domain+"$", "i")});
    if (!domainList) {
      WtMangedRouterMySQLDomainsList.insert({
        domain: domain,
        updateACS: false
      });
      Roles.addUsersToRoles(this.userId, ['domain-admin']);
      return true;
    }
  }
  return false;
});

Meteor.method("wtManagedRouterCheckDomain", function (domain, ignoreCase) {
  //Case sensitive search by default
  if (typeof ignoreCase == "undefined") {
    ignoreCase = false;
  } else {
    ignoreCase = (ignoreCase === true) ? true : false;
  }
  if (domain && domain.trim().length>0 && domain.trim().indexOf(" ")==-1) {
    domain = domain.trim();
    if (ignoreCase) {
      var domainList = WtMangedRouterMySQLDomainsList.findOne({domain: new RegExp("^"+domain+"$", "i")});
    } else {
      var domainList = WtMangedRouterMySQLDomainsList.findOne({domain: domain});
    }
    if (!domainList) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
});

Meteor.method("wtManagedRouterGetDomain", function (domain, ignoreCase) {
  //Case sensitive search by default
  if (typeof ignoreCase == "undefined") {
    ignoreCase = false;
  } else {
    ignoreCase = (ignoreCase === true) ? true : false;
  }
  if (domain && domain.trim().length>0 && domain.trim().indexOf(" ")==-1) {
    if (ignoreCase) {
      var domainList = WtMangedRouterMySQLDomainsList.findOne({domain: new RegExp("^"+domain+"$", "i")});
    } else {
      var domainList = WtMangedRouterMySQLDomainsList.findOne({domain: domain});
    }
    if (!domainList) {
      return false;
    } else {
      return domainList;
    }
  } else {
    return false;
  }
});
