Template.wtManagedRouterMySQLManageDomains.helpers({
  domainList: function () {
    return WtMangedRouterMySQLDomainsList.find();
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
  }
});