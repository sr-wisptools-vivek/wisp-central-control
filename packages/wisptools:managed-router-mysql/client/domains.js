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
  }
});

Template.wtManagedRouterMySQLDomain.events({
  "blur .mr-domain": function (event, template) {
    var userId = template.data._id;
    var domain = WtMangedRouterMySQLDomains.findOne({userId: userId});
    var name = $(event.target).val();

    if (domain) {
      WtMangedRouterMySQLDomains.update({_id: domain._id}, {$set: {name: name}});
    } else {
      WtMangedRouterMySQLDomains.insert({
        userId: userId,
        name: name
      });
    }
    WtGrowl.success('Domain updated.');
  }
});
