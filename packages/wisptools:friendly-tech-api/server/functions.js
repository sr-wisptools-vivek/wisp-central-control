var url = Meteor.settings.friendlytech.url;
var client = Soap.createClient(url);

WtFriendlyTech.FTGetDeviceInfo = function(deviceSerialNo) {

  var args = {devicesn: deviceSerialNo};
  try
  {
    var result = client.FTGetDeviceInfo(args);
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
  var args = {
    devicesn: deviceSerialNo, 
    arraynames:{ string: names },
    source: CPEStatus(deviceSerialNo)
  };
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
  try
  {
    var result = client.FTSetDeviceParameters(args);
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
  try
  {
    var result = client.FTGetDeviceParameters(args);
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

