
WtFriendlyTech.FTGetDeviceInfo = function(username, fullname, telephone) {
  
  var url = Meteor.settings.friendlytech.url;
  var args = {'username': username, 'fullname': fullname, 'telephone': telephone};

  try
  {
    console.log("inside soap client try");
    console.log(Soap);
    var client = Soap.createClient(url);
    console.log(client);
    var result = client.MyFunction(args);
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
