Template.wtFriendlyTechConnDevices.created = function (){

    var manufacturer = Session.get('Manufacturer');
    var model = Session.get('Model');
   
    if(typeof manufacturer === 'undefined' || typeof model === 'undefined')
    {
      manufacturer = "READYNET";
      model = "WRT500";
    }

    Meteor.call('wtGetRouterHosts', "RNV5000511",acsDeviceConfig[manufacturer][model].hosts.table.items, function(err,response) {
      if(err) {
        console.log("Error:" + err.reason);
        return;
      }
      if(response!= "failed")
      {

      }
      else
      {
        console.log(response);
      }
    });
   // console.log(acsDeviceConfig['READYNET']['WRT500'].hosts);
}