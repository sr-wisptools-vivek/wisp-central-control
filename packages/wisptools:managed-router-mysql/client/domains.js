Template.wtManagedRouterMySQLDomains.helpers({
  userList: function () {
    return Meteor.users.find();  
  },
  domainName: function () {
    var user = this;
    var domain = WtMangedRouterMySQLDomains.findOne({userId: user._id});
    if (domain) {
      return domain.name;
    }
    return "Not Set";
  },
  changeDomain: function(){
    return Session.equals('managedRouterChangeDomain', this._id);
  },
  domains: function () {    
      return WtMangedRouterMySQLDomainsList.find();   
  },
});

Template.wtManagedRouterMySQLDomains.events({
  "click .domain-name": function (e,t) {
    Session.set('managedRouterChangeDomain',this._id);
    Tracker.afterFlush(function() { //Focus on textfield after text is converted. 
          this.find('.mr-domain-select').focus()
    }.bind(t));
  },
  'change #selectDomain': function(e) {
    var selectedDomain = $(e.target).val();
    if (selectedDomain == 1) {
      Session.set('managedRouterSelectDomain', null);
    } else {
      Session.set('managedRouterSelectDomain', selectedDomain);
    }
  }
});

Template.wtManagedRouterMySQLDomain.helpers({    
  domains: function () {
    return WtMangedRouterMySQLDomainsList.find();
  },  
  selected: function (userId) {
      var domain = this.domain;
      var userDomain = WtMangedRouterMySQLDomains.findOne({userId: userId});
      if(userDomain){
        return (domain == userDomain.name) ? 'selected' : '';
      }
      return '';
  }
});

Template.wtManagedRouterMySQLDomain.events({
  "blur .mr-domain-select": function () {
    var userId = this.user;
    var newDomain = $('.mr-domain-select').val();
    var domain = WtMangedRouterMySQLDomains.findOne({userId: userId});
    if (domain) {
      if(domain.name == newDomain){
        Session.set('managedRouterChangeDomain', null);    
      } else {
        WtMangedRouterMySQLDomains.update({_id: domain._id}, {$set: {name: newDomain}});
        WtGrowl.success('Domain updated.');
      }
    } else {
      WtMangedRouterMySQLDomains.insert({
        userId: userId,
        name: newDomain
      });
      WtGrowl.success('Domain updated.');
    }
    Session.set('managedRouterChangeDomain', null);    
  }
});
