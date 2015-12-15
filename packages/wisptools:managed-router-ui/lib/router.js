Router.route('/ft/interface',{
  name: 'ftInterface',
  template: 'wtFriendlyTechInterface'
});

Router.onBeforeAction(function() {
  this.next();
});
