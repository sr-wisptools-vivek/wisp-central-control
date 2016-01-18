Template.wtFriendlyTechRouterConfig.created = function(){
  var manufacturer = Session.get('Manufacturer');
  var model = Session.get('Model');
  if(typeof manufacturer === 'undefined' || typeof model === 'undefined')
  {
    manufacturer = "READYNET";
    model = "WRT500";
  }
  var data = acsDeviceConfig["READYNET"]["WRT500"].routerConfig.form.columns;
  var columnCount = data.length;
  var namesArray =[];
  for(var i=0; i<columnCount; i++){
  var names = data[i].items;
    for(var k=0; k<names.length; k++){
      var namesItems = names[k].acs;
      namesArray.push(namesItems);
    }
  }
  requestData = namesArray.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]); //remove duplicates
  console.log(requestData);
  Meteor.call('wtrouterConfig', "RNV5002747",requestData, function(err,response) {
    responseData = response.FTGetDeviceParametersResult.Params.ParamWSDL;
    var resultObj = [];
    var ParamWSDL = responseData.FTGetDeviceParametersResult.Params.ParamWSDL;
    for(var i=0; i<columnCount; i++){
    var names = data[i].items;
    for(var k=0; k<names.length; k++){
      var namesItems = names[k].acs;
      var found = ParamWSDL.filter(function(item) { return item.Name === namesItems; });
      if(typeof found[0].Value === 'object')
      {
        var retValue = "";
      }
      else
      {
        var retValue = found[0].Value;
      }
      var retName = found[0].Name;
      resultObj[retName] = retValue;
      }
    }
    console.log(resultObj);
  });
}

Template.wtFriendlyTechRouterConfig.helpers({
  formData: function(){
    return acsDeviceConfig["READYNET"]["WRT500"].routerConfig.form.columns;
  },
  item1Selected: function (item_no) {
    console.log(item_no);
    return (true === true) ? 'selected' : '';
  },
  item1DisabledSelected: function () {
    return '';
  }
});

Template.registerHelper("dropdown",function(a){
  if (a=="dropdown") 
  {
    return true;
  }
  else
  {
    return false;
  }
});

Template.registerHelper("boolValue",function(a){
  if (a=="bool") 
  {
    return true;
  }
  else
  {
    return false;
  }
});

Template.registerHelper("acsName",function(a){
  var acsname = "InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.MaxAddress";
  var acsStr = acsname.split(/[\s.]+/);
  return acsStr[acsStr.length-1]; //return last string after splitting usind dot(.)
});

Template.registerHelper("isPassword",function(a){
  if(a=="password")
  {
    return true;
  }
  else
  {
    return false;
  }
});
Template.registerHelper("notSelect",function(a){
  if(a!="bool" && a!="dropdown")
  {
    return true;
  }
  else
  {
    return false;
  }
});