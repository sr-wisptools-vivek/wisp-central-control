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