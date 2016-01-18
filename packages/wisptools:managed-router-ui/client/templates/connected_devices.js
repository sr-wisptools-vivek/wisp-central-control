Template.wtFriendlyTechConnDevices.created = function (){
  var manufacturer = Session.get('Manufacturer');
  var model = Session.get('Model');
  if(typeof manufacturer === 'undefined' || typeof model === 'undefined')
  {
    manufacturer = "READYNET";
    model = "WRT500";
  }
  var data = acsDeviceConfig["READYNET"]["WRT500"].hosts.table;
  var count = data.count;
  var names = data.items;
  var namesArray = names.map(function(names) {
    var str = names['acs'];
    var requiredPortion = str.split("[X]");
    var newStr = requiredPortion[0];
    return newStr;
  });
  requestData = namesArray.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]); //remove duplicates
  requestData.push(count);

  Meteor.call('wtGetRouterHosts', "RNV5002747",requestData, function(err,response) {
    responseData = response.FTGetDeviceParametersResult.Params.ParamWSDL;
    var hostCount = 0;
    var inter={};
    for (i in responseData ) {
      if(responseData[i].Name == count)
      {
        hostCount = responseData[i].Value;
      }
    }
    for (i in responseData ) {
      inter[responseData[i].Name]=responseData[i].Value;
    }
    var connectedDevicesData = [];
    var connectedDevices = data.items;
    for(var k=1; k <= hostCount; k++)
    {
      var connectedDevicesResult = [];  
      for (j in connectedDevices)
      {
        var acsResponseInter = connectedDevices[j]['acs'];
        var re = '[X]';
        var acsResponse = acsResponseInter.replace(re, k);
        if(inter.hasOwnProperty(acsResponse)){
          if(typeof inter[acsResponse] === 'object')
          {
            var interResponse = "UNKNOWN";
          }
          else
          {
            var interResponse = inter[acsResponse];
          }
           connectedDevicesResult.push(interResponse);
        }
      }
      connectedDevicesData[k] = connectedDevicesResult;
    }
    Session.set("connectedDevicesData", connectedDevicesData);
  });
}
Template.wtFriendlyTechConnDevices.connectedDevicesData = function (){ return Session.get("connectedDevicesData");}
