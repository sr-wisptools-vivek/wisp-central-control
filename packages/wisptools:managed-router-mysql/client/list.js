Template.wtManagedRouterMySQLList.helpers({
  routers: function () {
    console.log(Template.instance().routerList.get());
    return Template.instance().routerList.get();
  },
  editingName: function(){
    return Session.equals('managedRouterEditingName', this.id);
  },
  editingSerial: function(){
    return Session.equals('managedRouterEditingSerial', this.id);
  },
  editingMac: function(){
    return Session.equals('managedRouterEditingMac', this.id);
  } 
});

Template.wtManagedRouterMySQLList.created = function () {
  var self = this;
  self.routerList = new ReactiveVar([]);

  Meteor.call('wtManagedRouterMySQLGetLimit', function (err, res) {
    if (err)
      console.log(err)
    else 
      self.routerList.set(res);
  });

}

Template.wtManagedRouterMySQLList.events({
  'submit .mr-search': function(e, t) {
    e.preventDefault();
    Meteor.call('wtManagedRouterMySQLSearch', e.target[0].value, function (err, res) {
      if (err)
        WtGrowl.fail('Search Failed');
      else 
        t.routerList.set(res);
    });
  },
  'submit .mr-add': function(e, t) {
    e.preventDefault();
    var name = e.target[0].value;
    var serial = e.target[1].value.toUpperCase();
    var mac = e.target[2].value.toUpperCase().replace(":", "").replace(".", "");
    var hasError = false;
    if (mac.length != 12) {
      WtGrowl.fail('Incorrect MAC Address Length');
      hasError = true;
    }
    if (serial.length != 10) {
      WtGrowl.fail('Incorrect Serial Number Length');
      hasError = true;
    }
    if (hasError) return;

    var router = {
      name: name,
      serial: serial,
      mac: mac,
      make: 'READYNET',
      model: 'WRT500'
    };

    Meteor.call('wtManagedRouterMySQLAdd', router, function (err, res) {
      if (err) {
        WtGrowl.fail(err.reason);
      } else {
        WtGrowl.success('Router Added');
        var tmp = t.routerList.get();
        tmp.push(res[0]);
        t.routerList.set(tmp);
      }
    });
  },
  'click .routerName': function(e,t){ //event to change router name to textfield on click.
    Session.set('managedRouterEditingName', this.id);
    Tracker.afterFlush(function() {
          this.find('input#editName').focus()
    }.bind(t));
  },
  'blur .routerName': function(e){  //event to save updated router name.
    var newRouterName = e.target.value;
    var updateRouter = {
      name: newRouterName
    };
    var router = this;

    Meteor.call('wtManagedRouterMySQLUpdate', router,updateRouter, function (err, res) {
      if (err) {
        WtGrowl.fail(err.reason);
      } else {
        WtGrowl.success('Router Name Updated');
      }
    });
    Session.set('managedRouterEditingName', null);
  },
  'click .routerSerial': function(e,t){
    Session.set('managedRouterEditingSerial', this.id);
    Tracker.afterFlush(function() {
          this.find('input#editSerial').focus()
    }.bind(t));
  },
  'blur .routerSerial': function(){
    Session.set('managedRouterEditingSerial', null);
  },
  'click .routerMac': function(e,t){
    Session.set('managedRouterEditingMac', this.id);
    Tracker.afterFlush(function() {
          this.find('input#editMac').focus()
    }.bind(t));
  },
  'blur .routerMac': function(){
    Session.set('managedRouterEditingMac', null);
  }    
})
