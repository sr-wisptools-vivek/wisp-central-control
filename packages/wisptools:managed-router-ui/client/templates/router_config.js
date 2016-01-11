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
  //console.log(names);
    for(var k=0; k<names.length; k++){
      var namesItems = names[k].acs;
      namesArray.push(namesItems);
    }
  }
  //console.log(namesArray);
  requestData = namesArray.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]); //remove duplicates
  console.log(requestData);
  Meteor.call('wtrouterConfig', "RNV5002747",requestData, function(err,response) {
    responseData = response.FTGetDeviceParametersResult.Params.ParamWSDL;
    console.log(responseData);
    
  });
}