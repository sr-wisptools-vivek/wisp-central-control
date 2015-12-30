var url = Meteor.settings.friendlytech.url;
var client = Soap.createClient(url);

WtFriendlyTech.FTGetDeviceInfo = function(deviceSerialNo) {
  
  var args = {devicesn: deviceSerialNo};
  try
  {
    var result = client.FTGetDeviceInfo(args);
    console.log(result);
    return result;
  }
  catch (err)
  {
    if(err.error === 'soap-creation')
    {
      console.log('SOAP Client creation failed');
    }
    else if (err.error === 'soap-method')
    {
      console.log('SOAP Method call failed');
    }
    return err;
  }
}

WtFriendlyTech.FTCPEStatus = function(deviceSerialNo) {
  
  var args = {devicesn: deviceSerialNo};
  try
  {
    var result = client.FTCPEStatus(args);
    console.log(result);
    return result;
  }
  catch (err)
  {
    if(err.error === 'soap-creation')
    {
      console.log('SOAP Client creation failed');
    }
    else if (err.error === 'soap-method')
    {
      console.log('SOAP Method call failed');
    }
    return err;
  }
}

WtFriendlyTech.FTRebootDevice = function(deviceSerialNo) {
  
  var args = {devicesn: deviceSerialNo};
  try
  {
    var result = client.FTRebootDevice(args);
    console.log(result);
    return result;
  }
  catch (err)
  {
    if(err.error === 'soap-creation')
    {
      console.log('SOAP Client creation failed');
    }
    else if (err.error === 'soap-method')
    {
      console.log('SOAP Method call failed');
    }
    return err;
  }
}

WtFriendlyTech.FTResetToDefault = function(deviceSerialNo) {
  
  var args = {devicesn: deviceSerialNo};
  try
  {
    var result = client.FTResetToDefault(args);
    console.log(result);
    return result;
  }
  catch (err)
  {
    if(err.error === 'soap-creation')
    {
      console.log('SOAP Client creation failed');
    }
    else if (err.error === 'soap-method')
    {
      console.log('SOAP Method call failed');
    }
    return err;
  }
}

WtFriendlyTech.FTGetDeviceParameters = function(deviceSerialNo, names) {

  var CPEStatus = function(deviceSerialNo){
    var APIArgs = {devicesn:deviceSerialNo};
    var result = client.FTCPEStatus(APIArgs);
    console.log(result);
    if (result.FTCPEStatusResult.ErrorCode == 100)
      {
        var responseData = result.FTCPEStatusResult;
        if(responseData.Online == true)
        {
          return "0";
        }
        else
        {
          return "1";
        }
      }
    else
      {
        return "1";
      }
  };

  var args = {devicesn: deviceSerialNo, 
              arraynames:{ string: names },
              source: CPEStatus(deviceSerialNo)
             };
console.log(args);
  try
  {
    var result = client.FTGetDeviceParameters(args);
    console.log(JSON.stringify(result));
    return result;
  }
  catch (err)
  {
    if(err.error === 'soap-creation')
    {
      console.log('SOAP Client creation failed');
    }
    else if (err.error === 'soap-method')
    {
      console.log('SOAP Method call failed');
    }
    return err;
  }
}

WtFriendlyTech.FTSetDeviceParameters = function(deviceSerialNo, paramObject) {

  var args ={ devicesn: deviceSerialNo, 
              arrayparams: {
                "Param": paramObject
              }
            };


console.log(JSON.stringify(args));
  try
  {
    var result = client.FTSetDeviceParameters(args);
    console.log(JSON.stringify(result));
    return result;
  }
  catch (err)
  {
    if(err.error === 'soap-creation')
    {
      console.log('SOAP Client creation failed');
    }
    else if (err.error === 'soap-method')
    {
      console.log('SOAP Method call failed');
    }
    return err;
  }
}

WtFriendlyTech.FTGetRouterInfo = function(deviceSerialNo, names) {

  var CPEStatus = function(deviceSerialNo){
    var APIArgs = {devicesn:deviceSerialNo};
    var result = client.FTCPEStatus(APIArgs);
    console.log(result);
    if (result.FTCPEStatusResult.ErrorCode == 100)
      {
        var responseData = result.FTCPEStatusResult;
        if(responseData.Online == true)
        {
          return "0";
        }
        else
        {
          return "1";
        }
      }
    else
      {
        return "1";
      }
  };

  var args = {devicesn: deviceSerialNo, 
              arraynames:{ string: names },
              source: CPEStatus(deviceSerialNo)
             };
console.log(args);
  try
  {
    var result = client.FTGetDeviceParameters(args);
    console.log(JSON.stringify(result));
    return result;
  }
  catch (err)
  {
    if(err.error === 'soap-creation')
    {
      console.log('SOAP Client creation failed');
    }
    else if (err.error === 'soap-method')
    {
      console.log('SOAP Method call failed');
    }
    return err;
  }
}

WtFriendlyTech.FTGetHostsCount = function(deviceSerialNo, names) {

  var CPEStatus = 0;
  var count = names;
  //var itemsObj = names.items;
  var args = {devicesn: deviceSerialNo, 
              arraynames:{ string: [count] },
              source: CPEStatus
             };
  //console.log(args);
  try
  {
    var result = client.FTGetDeviceParameters(args);
    var response = result.FTGetDeviceParametersResult;
        if (response.ErrorCode == 100)
          {
            var deviceCount = response.Params.ParamWSDL[0].Value;
            //console.log(deviceCount);
            return deviceCount;

            /*
            var output = {};
            
            var itemsArray = itemsObj.map(function(itemsObj) {
                  var str = itemsObj['acs'];
                  var re = '[X]';
                  var newstr = str.replace(re, "2")
                  //console.log(newstr);
                  return newstr;
                });
            
            var requestArray = itemsObj.map(function(itemsObj) {
                  return itemsObj['acs'];
                });
            var request = ['InternetGatewayDevice.LANDevice.1.Hosts.Host.1.HostName','InternetGatewayDevice.LANDevice.1.Hosts.Host.2.HostName'];
            var arg2 = {devicesn: deviceSerialNo,
                  arraynames:{srting:requestArray},
                  source: CPEStatus
                };
            console.log(arg2);
            output = client.FTGetDeviceParameters(arg2);
            for (var i = 0; i <= deviceCount; i++) 
              {
                
                var arg2 = {devicesn: deviceSerialNo,
                  arraynames:{srting: ["InternetGatewayDevice.LANDevice.1.Hosts.Host."]},
                  source: CPEStatus
                };

                output[i] = client.FTGetDeviceParameters(arg2);
                
                
              }
            console.log(output);
            */
          }
  }
  catch (err)
  {
    if(err.error === 'soap-creation')
    {
      console.log('SOAP Client creation failed');
    }
    else if (err.error === 'soap-method')
    {
      console.log('SOAP Method call failed');
    }
    return err;
  }
}

WtFriendlyTech.FTGetHosts = function(deviceSerialNo, names) {

  var CPEStatus = 0;

  var args = {devicesn: deviceSerialNo, 
              arraynames:{ string: names },
              source: CPEStatus
             };
console.log(args);
  try
  {
    var result = client.FTGetDeviceParameters(args);
    console.log(JSON.stringify(result));
    return result;
  }
  catch (err)
  {
    if(err.error === 'soap-creation')
    {
      console.log('SOAP Client creation failed');
    }
    else if (err.error === 'soap-method')
    {
      console.log('SOAP Method call failed');
    }
    return err;
  }
}
