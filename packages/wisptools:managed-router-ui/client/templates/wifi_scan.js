
Template.wtFriendlyTechWifiScan.created = function (){
  var manufacturer = Session.get('Manufacturer');
  var model = Session.get('Model');
  if(typeof manufacturer === 'undefined' || typeof model === 'undefined')
  {
    manufacturer = "READYNET";
    model = "WRT500";
  }
  var data = acsDeviceConfig["READYNET"]["WRT500"].wifiScan.table;
  var count = data.count; 
  var bestChannel = acsDeviceConfig["READYNET"]["WRT500"].wifiScan.bestChannel;
  var lastScan = acsDeviceConfig["READYNET"]["WRT500"].wifiScan.lastScan;
  var names = data.items;
  var namesArray = names.map(function(names){
    var str = names['acs'];
    var requiredPortion = str.split("[X]");
    var newStr = requiredPortion[0];
    return newStr;
  });
  requestData = namesArray.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]); //remove duplicates
  requestData.push(count);
  requestData.push(bestChannel);
  requestData.push(lastScan);
  Meteor.call('wtWifiScan', "RNV5002747",requestData, function(err,response) {
    responseData = response.FTGetDeviceParametersResult.Params.ParamWSDL;
    var hostCount = 0;
    var bestChannelResponse = 0;
    var lastScanResponse = 0;
    var responseData = response.FTGetDeviceParametersResult.Params.ParamWSDL;      
    var inter={};
    for (i in responseData ) {
      if(responseData[i].Name == count)
      {
        hostCount = responseData[i].Value;
      }
      if(responseData[i].Name == bestChannel)
      {
        bestChannelResponse = responseData[i].Value;
      }
      if(responseData[i].Name == lastScan)
      {
        lastScanResponse = responseData[i].Value;
      }
    }
    for (i in responseData ) {
      inter[responseData[i].Name]=responseData[i].Value;
    }
    var wifiScanInfo = data.items;
    var tableData = [];
    for(var k=1; k <= hostCount; k++){
      var wifiScanResult = [];
      for (j in wifiScanInfo){
        var acsResponseInter = wifiScanInfo[j]['acs'];
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
          wifiScanResult.push(interResponse);
        }
      }
      tableData[k] = wifiScanResult;
    }
    Session.set("tableData", tableData);
    Session.set("bestChannelResponse", bestChannelResponse);
    Session.set("lastScanResponse", lastScanResponse);
  });
}

Template.wtFriendlyTechWifiScan.bestChannelResponse = function (){ return Session.get("bestChannelResponse");}
Template.wtFriendlyTechWifiScan.lastScanResponse = function (){ return Session.get("lastScanResponse");}
Template.wtFriendlyTechWifiScan.tableData = function (){ return Session.get("tableData");}
