WtMangedRouterMySQLDomains = WtCollection('wt_managed_router_mysql_domains', function() {
  return Roles.userIsInRole(this.userId, ['admin']);
});