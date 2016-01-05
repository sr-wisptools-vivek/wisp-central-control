Template.wtFriendlyTechConnDevices.created = function (){
//console.log("wtFriendlyTechConnDevices created");
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
      hostCount = response.FTGetDeviceParametersResult.Params.ParamWSDL[0].Value;
      var inter={};
      for (i in responseData ) {
        inter[responseData[i].Name]=responseData[i].Value;
      }
      console.log(inter);   
      var connectedDevicesInfo = {};
      var connectedDevices = data.items;
      for (j in connectedDevices) {
        var acsResponseInter = connectedDevices[j]['acs'];
        var re = '[X]';
        var acsResponse = acsResponseInter.replace(re, hostCount);
        if(inter.hasOwnProperty(acsResponse)){
          connectedDevicesInfo[connectedDevices[j].name]=inter[acsResponse];
        }
      }
      console.log(connectedDevicesInfo);
    });
   // console.log(acsDeviceConfig['READYNET']['WRT500'].hosts);
}