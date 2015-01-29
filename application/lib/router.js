Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { /*return Meteor.subscribe('interaction');*/ }
});

Router.route('/', {name: 'dashboard'});
/*
Router.route('/interaction/:_id', {
  name: 'interactionPage',
  data: function() { return Posts.findOne(this.params._id); }
});
*/

Router.route('/newsale', {
    name: 'newsale', 
    template: 'wtSalesInteraction'
});


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
}
Router.onBeforeAction('dataNotFound', {only: 'interactionPage'});
Router.onBeforeAction(requireLogin);
