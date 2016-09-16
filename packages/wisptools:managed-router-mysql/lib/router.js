Router.route('/managed-routers', {
  name: 'wtManagedRouterMySQLList',
  template: 'wtManagedRouterMySQLList'
});

Router.map(function() {
  this.route('/admin/managed-router-domains', {
    path: '/admin/managed-router-domains',
    name: 'wtManagedRouterMySQLDomains', 
    template: 'wtManagedRouterMySQLDomains',

    onBeforeAction: function() {
      user = Meteor.user();
      if(!Roles.userIsInRole(user, ['admin'])) {
       
        return;
      }
   
     this.next();
    }
  });
    
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
