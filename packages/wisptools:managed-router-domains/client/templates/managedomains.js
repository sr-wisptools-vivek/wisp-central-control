Template.wtManagedRouterMySQLManageDomains.helpers({
  domainList: function () {
    return WtMangedRouterMySQLDomainsList.find();
  },
  editingDomain: function(){
    return Session.equals('managedRouterDomainEditingName', this._id);
  }
});

Template.wtManagedRouterMySQLManageDomains.events({
  "click .addDomainbtn": function () {
    var newDomain = $('#domainName').val();
    var findDomain = WtMangedRouterMySQLDomainsList.findOne({domain: newDomain});
    
    if(findDomain){
      WtGrowl.fail('Duplicate Domain');
    } else {
      if($('#updateACS').is(':checked')){
        //Need code for Updating ACS Option
        //WtGrowl.success('ACS Updated');    
      }
      WtMangedRouterMySQLDomainsList.insert({
          domain: newDomain
      });
      WtGrowl.success('Domain Added.');
    }
    $('#domainName').val('');
  },
  'click .domainName': function(e,t){ //event to change router name to textfield on click.
    
    Session.set('managedRouterDomainEditingName', this._id);
    Tracker.afterFlush(function() { //Focus on textfield after text is converted. 
          this.find('input#editDomain').focus()
    }.bind(t));
  },
  'blur .domainName, keypress .domainName': function(e,t){  //event to save updated router name.
    var keyPressed = e.which;
    var eventType = e.type;

    if ((eventType=="keypress" && keyPressed == 13) || eventType == "focusout") { //Executed if enter is hit or on blur or tab out
      var newDomainName = e.target.value.trim();

      if (newDomainName !== ""){  
        var Domain = this;
        
        if (Domain.domain !== newDomainName ) { //Execute if value is changed.
          WtMangedRouterMySQLDomainsList.update({_id: Domain._id}, {$set: {domain: newDomainName}});
          Session.set('managedRouterDomainEditingName', null);
          WtGrowl.success('Domain Updated');
        } else {
          Session.set('managedRouterDomainEditingName', null);
        }
      } else {
        Session.set('managedRouterDomainEditingName', null);
      }
    }
  },
  'click .remove-domain': function() {
    Session.set('managedRouterDomainDelete', this);
  },
  'click #deleteDomain': function() {
    var removeDomain = Session.get('managedRouterDomainDelete');      
    //check if domain is assigned to any user.
    var item = WtMangedRouterMySQLDomains.findOne({name: removeDomain.domain});
    if (item) {
      Session.set('managedRouterDomainDelete', null);
      WtGrowl.fail('Domain Assigned to User.');
    } else {
      WtMangedRouterMySQLDomainsList.remove({_id : removeDomain._id});
      WtGrowl.success('Domain Deleted');
    }
  },
  'click #cancelDelete': function() {
    Session.set('managedRouterDomainDelete', null);  
  }
});