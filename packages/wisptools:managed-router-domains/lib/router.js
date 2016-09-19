Router.map(function() {
  this.route('/admin/manage-domains', {
    path: '/admin/manage-domains',
    name: 'wtManagedRouterMySQLManageDomains', 
    template: 'wtManagedRouterMySQLManageDomains',

    onBeforeAction: function() {
      user = Meteor.user();
      if(!Roles.userIsInRole(user, ['admin'])) {

        return;
      }

     this.next();
    }
  });
});
