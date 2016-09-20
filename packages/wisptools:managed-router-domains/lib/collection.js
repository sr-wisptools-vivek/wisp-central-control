WtMangedRouterMySQLDomainsList = WtCollection('wt_managed_router_domains_list', function() {
  return Roles.userIsInRole(this.userId, ['admin']);
});