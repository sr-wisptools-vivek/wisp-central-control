Template.wtManagedRouterMySQLManageDomains.helpers({
  domainList: function () {
    return WtMangedRouterMySQLDomainsList.find();
  },
  editingDomain: function (){
    return Session.equals('managedRouterDomainEditingName', this._id);
  },
  updateACS: function () {
    var domain = this;
    if(domain.updateACS){
      return "checked";  
    } else {
      return "";
    }
  }
});

Template.wtManagedRouterMySQLManageDomains.events({
  "click .addDomainbtn": function () {
    var newDomain = $('#domainName').val();
    var findDomain = WtMangedRouterMySQLDomainsList.findOne({domain: newDomain});
    var updateACS = false;
    
    if(findDomain){
      WtGrowl.fail('Duplicate Domain');
    } else {
      if($('#updateACS').is(':checked')){
        updateACS = true;
      }
      WtMangedRouterMySQLDomainsList.insert({
          domain: newDomain,
          updateACS:updateACS
      });
      WtGrowl.success('Domain Added.');
    }
    $('#domainName').val('');
    $('#updateACS').attr('checked', false);
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
          Meteor.call('wtManagedRouterUpdateUserDomain', Domain.domain, newDomainName);
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
  'click .update-acs-chkbx': function (e,t) {
      var status = false;
      status = $(e.target).is(":checked");
      WtMangedRouterMySQLDomainsList.update({_id: this._id}, {$set: {updateACS: status}});
      WtGrowl.success('Updated');
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