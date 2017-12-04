Template.wtManagedRouterMySQLList.helpers({
  routers: function () {
    if (this.customerId) {
      var customerRouterSerialNumbers = Template.instance().customerRouterSerialNumbers.get();
      var routerList = Template.instance().routerList.get();
      var filteredRouterList = [];
      for (var i=0; i<routerList.length; i++) {
        if (customerRouterSerialNumbers.indexOf(routerList[i].serial) > -1) {
          filteredRouterList.push(routerList[i]);
        }
      }
      return filteredRouterList;
    } else {
      return Template.instance().routerList.get();
    }
  },
  totalCount: function () {
    return Template.instance().totalCount.get();
  },
  displayCount: function () {
    return Template.instance().routerList.get().length;
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
  },
  hasMore: function() {
    return !(Template.instance().routerList.get().length % Template.instance().queryLimit);
  },
  showSpinner: function() {
    return Template.instance().showSpinner.get()
  }
});

Template.wtManagedRouterMySQLList.onRendered(function () {
  if (Session.get('show-free-router') === true) {
    Session.set('show-free-router', false);
    Router.go('wtFreeRouterForm');
  }
});

Template.wtManagedRouterMySQLList.created = function () {
  var self = this;
  self.routerList = new ReactiveVar([]);
  self.showSpinner = new ReactiveVar(false);
  self.totalCount = new ReactiveVar(0);
  self.queryLimit = 20;
  self.queryPage = 1;
  self.searchStr = '';
  self.sortStr = 0;
  self.customerRouterSerialNumbers = new ReactiveVar([]);

  Meteor.call('wtManagedRouterMySQLGetLimit', self.queryLimit, function (err, res) {
    if (err)
      console.log(err)
    else {
      self.routerList.set(res.res);
      self.totalCount.set(res.count);
    }
  });

  if (this.data && this.data.customerId) {
    Meteor.call('wtBraintreeCustomerGetManagedRouters', this.data.customerId, function (err, res) {
      if (err) {
        console.log(err);
      } else {
        var serialNumbers = [];
        for (var i=0; i<res.length; i++) {
          serialNumbers.push(res[i].serialNumber);
        }
        self.customerRouterSerialNumbers.set(serialNumbers);
      }
    });
  }
}

Template.wtManagedRouterMySQLList.events({
  "click #showMoreBtn": function (e, t) {
    e.preventDefault();
    e.stopPropagation();
    t.queryPage++;
    t.showSpinner.set(true);
    var search = {
      q: $('#search-str').val(),
      limit: t.queryLimit,
      page: t.queryPage,
      sort: $('#sort-str').val()
    }
    Meteor.call('wtManagedRouterMySQLSearch', search, function (err, res) {
      if (err) {
        WtGrowl.fail('Looks like this is the end.');
      } else {
        // Append the results to the router list.
        var list = t.routerList.get();
        list = list.concat(res.res);
        t.routerList.set(list);
        t.totalCount.set(res.count);
      }
      t.showSpinner.set(false);
    });

  },
  'submit .mr-search': function(e, t) {
    e.preventDefault();
    t.queryPage = 1;
    t.routerList.set([]); // Clear the slate, so all the statuses get rechecked in the results
    t.searchStr = e.target[0].value;
    var search = {
      q: e.target[0].value,
      page: 1,
      sort: t.sortStr
    }
    Meteor.call('wtManagedRouterMySQLSearch', search, function (err, res) {
      if (err)
        WtGrowl.fail('Search Failed');
      else
        t.routerList.set(res.res);
        t.totalCount.set(res.count);
    });
  },
  'submit .mr-sort': function(e, t) {
    e.preventDefault();
    t.queryPage = 1;
    t.routerList.set([]); // Clear the slate, so all the statuses get rechecked in the results
    t.sortStr = e.target[0].value;
    var search = {
      q: t.searchStr,
      page: 1,
      sort: e.target[0].value
    }
    Meteor.call('wtManagedRouterMySQLSearch', search, function (err, res) {
      if (err)
        WtGrowl.fail('Sort Failed');
      else {
        t.routerList.set(res.res);
        t.totalCount.set(res.count);
      }
    });
  },
  'submit .mr-add': function(e, t) {
    e.preventDefault();
    if(Session.get('managedRouterEditingName') || Session.get('managedRouterEditingSerial') || Session.get('managedRouterEditingMac')) {
      return;
    }
    var name = e.target[0].value.trim();
    var serial = e.target[1].value.trim().toUpperCase();
    var mac = e.target[2].value.trim().toUpperCase().replace(/:/g, "").replace(/\./g, "").replace(/-/g, "");
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
    };

    var customerId = false;
    if (this.customerId) {
      customerId = this.customerId;
    }

    // clear the add form
    e.target[0].value = '';
    e.target[1].value = '';
    e.target[2].value = '';

    Meteor.call('wtManagedRouterMySQLAdd', router, function (err, res) {
      if (err) {
        WtGrowl.fail(err.reason);
      } else {
        if (customerId) {
          Meteor.call('wtBraintreeCustomerAddManagedRouter', customerId, router.serial, function (err, res) {
            if (!err) {
              var list = t.customerRouterSerialNumbers.get();
              list = list.concat(router.serial);
              t.customerRouterSerialNumbers.set(list);
            }
          });
        }
        WtGrowl.success('Router Added');
        var list = t.routerList.get();
        list = res.res.concat(list);
        t.routerList.set(list);
        t.totalCount.set(res.count);
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
        router.new = updateRouter;
        if (router.name !== newRouterName) { //Execute if value is changed.
          Meteor.call('wtManagedRouterMySQLUpdate', router, function (err, res) {
            if (err) {
              WtGrowl.fail(err.reason);
              Session.set('managedRouterEditingName', null);
            } else {
              //refresh router list.
              Meteor.call('wtManagedRouterMySQLSearch', '', function(err,res){
                if(!err){
                  t.routerList.set(res.res);
                  t.totalCount.set(res.count);
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
        router.new = updateRouter;
        if(router.mac !== newRouterMac) { //Call method only when new serial number is entered.
          Meteor.call('wtManagedRouterMySQLUpdate', router, function (err, res) {
            if (err) {
              WtGrowl.fail(err.reason);
              Session.set('managedRouterEditingMac', null);
            } else {
              //Refresh router list.
              Meteor.call('wtManagedRouterMySQLSearch', '', function(err,res){
                if(!err){
                  t.routerList.set(res.res);
                  t.totalCount.set(res.count);
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
        t.routerList.set(res.res);
        t.totalCount.set(res.count);
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

Template.wtManagedRouterMySQLList.onRendered(function () {
  $('.routerTable').loadInModal('.addtomodal', function () {
    $('#iframeinmodal').on('load',function () {
        $('#siteloader-content').hide();
        var heightOfModal = Math.floor($(document).height() * 0.7);
        $('#iframeinmodal').css('height',heightOfModal+'px');
    });
  });
  $('.routerTable').on('mouseenter mouseleave','.removeRouter',function(e){
      $(this).toggleClass('btn-danger');
    }
  );
});

Template.wtManagedRouterIsOnline.onCreated(function () {
  this.doneChecking = new ReactiveVar(false);
  this.isOnline = new ReactiveVar(false);
});

Template.wtManagedRouterIsOnline.helpers({
  'doneChecking': function() {
    return Template.instance().doneChecking.get();
  },
  'isOnline': function() {
    return Template.instance().isOnline.get();
  },
});

Template.wtManagedRouterIsOnline.onRendered(function () {
  var _this = this;
  Meteor.call('wtManagedRouterIsOnline', {id: _this.data.id}, function(err, res) {
    if (res && res.online) _this.isOnline.set(true);
    _this.doneChecking.set(true);
  });
});