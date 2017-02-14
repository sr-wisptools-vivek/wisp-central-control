Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { /*return Meteor.subscribe('interaction');*/ }
});

Router.route('/', {name: 'home'});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
};

var redirectRouterList = function() {
  if (Meteor.user()) {
    if (!WtFreeRouter.findOne()) {
      Router.go('wtFreeRouterForm');
    } else {
      Router.go('wtManagedRouterMySQLList');
    }
  }
  this.next();
};

Router.onBeforeAction(redirectRouterList, {only: 'home'});
Router.onBeforeAction(requireLogin, {except: [
  'home',
  'wtAccountsInviteCreateAccount',
  'wtManagedRouterMySQLAPI'
]});
