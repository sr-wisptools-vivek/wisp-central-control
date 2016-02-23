Template.wtManagedRouterMySQLList.helpers({
  routers: function () {
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
  },
  restoreRouter: function() {
    return Session.equals('removedRouterId', this.id);
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
    if(Session.get('managedRouterEditingName') || Session.get('managedRouterEditingSerial') || Session.get('managedRouterEditingMac')) {
      return;
    }
    var name = e.target[0].value;
    var serial = e.target[1].value.toUpperCase();
    var mac = e.target[2].value.toUpperCase().replace(":", "").replace(".", "");
    var hasError = false;
    
    if (mac.length != 12) {
      WtGrowl.fail('Incorrect MAC Address Length');
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
    Tracker.afterFlush(function() { //Focus on textfield after text is converted. 
          this.find('input#editName').focus()
    }.bind(t));
  },
  'blur .routerName, keypress .routerName': function(e,t){  //event to save updated router name.
    var keyPressed = e.which;
    var eventType = e.type;

    if(eventType=="keypress" && keyPressed == 13) {
      e.preventDefault();
    }

    if((eventType=="keypress" && keyPressed == 13) || eventType == "focusout") { //Executed if enter is hit or on blur or tab out
      var newRouterName = e.target.value.trim();

      if (newRouterName !== ""){
        var updateRouter = {
          name: newRouterName
        };
        var router = this;
        if (router.name !== newRouterName) { //Execute if value is changed.
          Meteor.call('wtManagedRouterMySQLUpdate', router,updateRouter, function (err, res) {
            if (err) {
              WtGrowl.fail(err.reason);
              Session.set('managedRouterEditingName', null);
            } else {
              //refresh router list.
              Meteor.call('wtManagedRouterMySQLSearch', '', function(err,res){
                if(!err){
                  t.routerList.set(res);
                  WtGrowl.success('Router Name Updated');
                  Session.set('managedRouterEditingName', null);
                }
              }); 
            }
          });
        } else {
          Session.set('managedRouterEditingName', null);
        }
      } else {
        Session.set('managedRouterEditingName', null);
      }
    }
  },
  'click .routerMac': function(e,t){ //event to change mac to textfield on click.
    Session.set('managedRouterEditingMac', this.id);
    Tracker.afterFlush(function() { //Focus on textfield after text is converted. 
          this.find('input#editMac').focus()
    }.bind(t));
  },
  'blur .routerMac, keypress .routerMac ': function(e,t){
    var keyPressed = e.which;
    var eventType = e.type;

    if(eventType=="keypress" && keyPressed == 13) {
      e.preventDefault();
    }

    if((eventType=="keypress" && keyPressed == 13) || eventType == "focusout") {
      var newRouterMac = e.target.value.toUpperCase().replace(":", "").replace(".", "");

      if (newRouterMac.length == 12) {
        var updateRouter = {
          mac: newRouterMac
        };
        var router = this;
        if(router.mac !== newRouterMac) { //Call method only when new serial number is entered.
          Meteor.call('wtManagedRouterMySQLUpdate', router,updateRouter, function (err, res) {
            if (err) {
              WtGrowl.fail(err.reason);
              Session.set('managedRouterEditingMac', null);
            } else {
              //Refresh router list.
              Meteor.call('wtManagedRouterMySQLSearch', '', function(err,res){
                if(!err){
                  t.routerList.set(res);
                  WtGrowl.success('Router MAC Updated');
                  Session.set('managedRouterEditingMac', null);
                }
              });
            }
          });
        } else {
          Session.set('managedRouterEditingMac', null);
        }
      }else {
        WtGrowl.fail('Incorrect MAC Address Length');
        Session.set('managedRouterEditingMac', null);
      }      
    }
  }, 
  'click .removeRouter': function(e,t){ //event handler for delete modal
    e.preventDefault();
    Session.set('managedRouterRemoveRouter', this);
    //Remove previous delete router from routerList
    Meteor.call('wtManagedRouterMySQLSearch', '', function(err,res){
      if(!err){
        t.routerList.set(res);
      }
    });
  },
  'click #cancelDelete': function(){
    Session.set('managedRouterRemoveRouter', null);
  },
  'click #deleteRouter': function() {
    var removeRouter = Session.get('managedRouterRemoveRouter');
    Meteor.call('wtManagedRouterMySQLRemove', removeRouter, function (err, res) {
      if (err) {
        WtGrowl.fail(err.reason);
      } else {
        WtGrowl.success('Router Deleted ');
        var deletedRouter = Session.get('managedRouterRemoveRouter');
        Session.set('removedRouterId',deletedRouter.id);
      }
    });
  },
  'click .restoreRouter': function(e,t){
    e.preventDefault();
    var restoreRouter = this;
    Meteor.call('wtManagedRouterMySQLRestore', restoreRouter, function (err, res) {
      if (err) {
        WtGrowl.fail(err.reason);
      } else {
        WtGrowl.success('Router Restored');
        Session.set('removedRouterId', null);
      }
    });
  }    
});
