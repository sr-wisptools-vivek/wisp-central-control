Router.route('/bf/account/create', {
  name: 'create',
  template: 'wtCreateBfAccount'
  
});
Router.route('/bf/account/view', {
  name: 'view',
  template: 'wtViewBfAccount'
  
});
Router.route('/bf/account/accounts', {
  name: 'accounts',
  template: 'wtListBfAccounts'
  
});
Router.route('/bf/account/edit', {
  name: 'edit',
  template: 'wtEditBfAccounts'
  
});

Router.onBeforeAction(function() {
  this.next();
});
