
WtFriendlyTech.FTGetDeviceInfo = function(deviceSerialNo) {
  
  var url = Meteor.settings.friendlytech.url;
  var args = {devicesn: deviceSerialNo};

  try
  {
    console.log("inside soap client try");
    //console.log(Soap);
    var client = Soap.createClient(url);
    console.log(client);
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
  
  var url = Meteor.settings.friendlytech.url;
  var args = {devicesn: deviceSerialNo};

  try
  {
    var client = Soap.createClient(url);
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
  
  var url = Meteor.settings.friendlytech.url;
  var args = {devicesn: deviceSerialNo};

  try
  {
    var client = Soap.createClient(url);
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
  
  var url = Meteor.settings.friendlytech.url;
  var args = {devicesn: deviceSerialNo};

  try
  {
    var client = Soap.createClient(url);
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

WtFriendlyTech.FTGetDeviceParameters = function(deviceSerialNo) {

  var url = Meteor.settings.friendlytech.url;
  var CPEStatus = function(deviceSerialNo){
    var APIArgs = {devicesn:deviceSerialNo};
    var client = Soap.createClient(url);
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
              arraynames:{string: "InternetGatewayDevice.ManagementServer.URL", string: "InternetGatewayDevice.Time.NTPServer1"},
              source: CPEStatus(deviceSerialNo)
            };
console.log(args);
  try
  {
    var client = Soap.createClient(url);
    var result = client.FTGetDeviceParameters(args);
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
