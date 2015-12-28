if(Meteor.isClient){

Template.wtFriendlyTechInfo.routerInfo = function (){ return Session.get("routerInfo");}

Template.wtFriendlyTechInfo.helpers({
  
  Manufacturer: function(){
    console.log(Session.get("Manufacturer"));
    return Session.get("Manufacturer") || "Loading...";
  },
  Model: function(){
    console.log(Session.get("Model"));
    return Session.get("Model") || "Loading...";
  },
  LANMACAddress: function() {
    console.log(Session.get("LANMACAddress"));
    return Session.get("LANMACAddress") || "Loading...";
  },
  WANMACAddress: function() {
    console.log(Session.get("WANMACAddress"));
    return Session.get("WANMACAddress") || "Loading...";
  },
  SerialNumber: function() {
    console.log(Session.get("Serial"));
    return Session.get("Serial") || "Loading...";
  },
  FirmwareVersion: function() {
    console.log(Session.get("FirmwareVersion"));
    return Session.get("FirmwareVersion") || "Loading...";
  }
});

Template.wtFriendlyTechInfo.created = function (){

    var manufacturer = Session.get('Manufacturer');
    var model = Session.get('Model');
    if(typeof manufacturer === 'undefined' || typeof model === 'undefined')
    {
      manufacturer = "DEFAULT";
      model = "DEFAULT";
    }
    Meteor.call('wtGetRouterInfo', "RNV5000511",acsDeviceConfig[manufacturer][model].info, function(err,response) {
      if(err) {
        console.log("Error:" + err.reason);
        return;
      }
      if(response!= "failed")
      {
        var str = response;
        var acs = acsDeviceConfig[manufacturer][model].info;
        var acsArray = acs.map(function(acs) {
          return acs['acs'];
        });
        
        console.log(acsArray);
        console.log(response);
        var routerInfo={};
        var apiResult = response;
        var inter={};
        for (i in apiResult ) {
          inter[apiResult[i].Name]=apiResult[i].Value;
        }
        var routerConfig = acsDeviceConfig[manufacturer][model].info;
        for (j in routerConfig) {
          console.log(routerConfig[j]['acs']);
          if(inter.hasOwnProperty(routerConfig[j]['acs'])) {
            routerInfo[routerConfig[j].name]=inter[routerConfig[j]['acs']];
          }
        }
        console.log(routerInfo);
        Session.set("routerInfo", routerInfo);
      }
      else
      {
        console.log(response);
      }
    });
   // console.log(acsDeviceConfig['READYNET']['WRT500'].info);
}

Template.registerHelper("objectToPairs",function(object){
  return _.map(object, function(value, key) {
    return {
      key: key,
      value: value
    };
  });
});

Template.wtFriendlyTechInterface.events({

});

}