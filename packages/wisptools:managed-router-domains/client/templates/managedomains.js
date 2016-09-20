Template.wtManagedRouterMySQLManageDomains.helpers({
  domainList: function () {
    return Meteor.wt_managed_router_domains_list.find();
  }
});

Template.wtManagedRouterMySQLManageDomains.events({
  "click .addDomainbtn": function () {
    WtGrowl.success('Domain Added.');
  }
});