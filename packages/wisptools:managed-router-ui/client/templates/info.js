if(Meteor.isClient){

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
 /*   
    var names = ["InternetGatewayDevice.DeviceInfo.UpTime"];
    Meteor.call('wtManagedGetDeviceParameters', "RNV5000511", names, function(err,response) {
      if(err) {
        console.log("Error:" + err.reason);
        return;
      }
      if(response!= "failed")
      {
        var hours = Math.floor(response / (60*60));
        var minutes = Math.floor((response-(hours*3600))/60);
        var newTime = hours+" hours and "+minutes+" minutes";
        Session.set("UpTime", newTime);
      }
      else
      {
        Session.set("UpTime", 'Uptime not available');
      }
    });
*/
    Meteor.call('wtManagedRouterGetInfo', "RNV5000511","ManufacturerName", function(err,response) {
      if(err) {
        console.log("Error:" + err.reason);
        return;
      }
      if(response!= "failed")
      {
        var str = response;
        Session.set("Manufacturer", response);
      }
      else
      {
        Session.set("Manufacturer", 'Manufacturer Name not available');
      }
    });
    Meteor.call('wtManagedRouterGetInfo', "RNV5000511","ModelName", function(err,response) {
      if(err) {
        console.log("Error:" + err.reason);
        return;
      }
      if(response!= "failed")
      {
        var str = response;
        Session.set("Model", response);
      }
      else
      {
        Session.set("Model", 'Model not available');
      }
    });
    Meteor.call('wtManagedRouterGetInfo', "RNV5000511","Serial", function(err,response) {
      if(err) {
        console.log("Error:" + err.reason);
        return;
      }
      if(response!= "failed")
      {
        var str = response;
        Session.set("Serial", response);
      }
      else
      {
        Session.set("Serial", 'Model not available');
      }
    });
}

Template.wtFriendlyTechInterface.events({

});

}