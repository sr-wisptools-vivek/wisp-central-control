if(Meteor.isClient){

Template.wtFriendlyTechInterface.helpers({
  CPEStatus: function(){
    console.log(Session.get("CPEStatus"));
    return Session.get("CPEStatus") || "Loading...";
  },
  UpTime: function(){
    console.log(Session.get("UpTime"));
    return Session.get("UpTime") || "Loading...";
  },
  lastCheckIn: function() {
    console.log(Session.get("lastCheckIn"));
    return Session.get("lastCheckIn") || "Loading...";
  }
});

Template.wtFriendlyTechInterface.rendered = function (){
  Meteor.call('wtManagedRouterGetCPE', "RNV5000511", function(err,response){
    if(err)
      console.log(err);
    else 
    {
     if(response == true)
      {
        Session.set("CPEStatus", '<button type="button" class="btn btn-success btn-xs">Online</button>');
      }
      else
      {
        Session.set("CPEStatus", '<button type="button" class="btn btn-danger btn-xs">Offline</button>');
      }
    }
  });
  var names = ["InternetGatewayDevice.DeviceInfo.UpTime"];
  Meteor.call('wtManagedGetDeviceParameters', "RNV5000511", names, function(err,response) {
    if(err)
    {
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
  Meteor.call('wtManagedRouterGetInfo', "RNV5000511","Updated", function(err,response) {
    if(err) {
      console.log("Error:" + err.reason);
      return;
    }
    if(response!= "failed")
    {
      var str = response;
      //var res = str.substr(4, 24);
      /*
      var time1 = response.substring(16, 24);
      var diff = time1.getTime() - getTime(); // this is a time in milliseconds
      var diff_as_date = new Date(diff);
      var timeDiff = diff.getHours()+"hours "+diff.getMinutes()+" minutes "+diff.getSeconds()+"seconds";
      */
      Session.set("lastCheckIn", response);
    }
    else
    {
      Session.set("lastCheckIn", 'Last Check In time not available');
    }
  });
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
