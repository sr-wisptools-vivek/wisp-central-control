Template.wtManagedRouterMySQLDomains.helpers({
  userList: function () {
    return Meteor.users.find();
  }
});

Template.wtManagedRouterMySQLDomain.helpers({    
  domainName: function (userId) {
    var domain = WtMangedRouterMySQLDomains.findOne({userId: userId});
    if (domain) {
      return domain.name;
    }
    return "";
  },
  domains: function () {
    return WtMangedRouterMySQLDomainsList.find();
  },  
  selected: function (userId) {
      var domain = this.domain;
      var userDomain = WtMangedRouterMySQLDomains.findOne({userId: userId});
      if(userDomain){
        return (domain == userDomain.name) ? 'selected' : '';
      }
      return '';
  }
});

Template.wtManagedRouterMySQLDomain.events({
  "change .mr-domain-select": function () {
    var userId = this.user;
    var newDomain = $('.mr-domain-select').val();
    var domain = WtMangedRouterMySQLDomains.findOne({userId: userId});
    var test;
    console.log(domain);
    if (domain) {
      WtMangedRouterMySQLDomains.update({_id: domain._id}, {$set: {name: newDomain}});
      //testing Domain name not being updated. 
      test = WtMangedRouterMySQLDomains.findOne({_id: domain._id});
      console.log(test);
      console.log(domain._id);
    } else {
      WtMangedRouterMySQLDomains.insert({
        userId: userId,
        name: newDomain
      });
    }
    WtGrowl.success('Domain updated.');
  }
});
