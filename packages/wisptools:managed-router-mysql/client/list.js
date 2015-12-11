Template.wtManagedRouterMySQLList.helpers({
  routers: function () {
    return Template.instance().routerList.get();
  }
});

Template.wtManagedRouterMySQLList.created = function () {
  var self = this;
  self.routerList = new ReactiveVar([]);

  Meteor.call('wtManagedRouterMySQLGetAll', function (err, res) {
    if (err)
      console.log(err)
    else 
      self.routerList.set(res);
  });

}
