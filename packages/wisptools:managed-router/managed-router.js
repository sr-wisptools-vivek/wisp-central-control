// Write your package code here!
if (Meteor.isServer) {
	Meteor.methods({

		  "wtManagedRouterGetInfo": function(deviceSerialNo, param){
		  	if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) throw new Meteor.Error(401, "Not authorized"); // Check if calling user is admin
	      var response = WtFriendlyTech.FTGetDeviceInfo(deviceSerialNo);
	      //console.log(response);
	      if (response.FTGetDeviceInfoResult.ErrorCode == 100)
	      	{
	      		var responseData = response.FTGetDeviceInfoResult;
	      		//return "ManufacturerName : "+responseData.ManufacturerName+" ModelName : "+responseData.ModelName;
	      		return responseData[param];
	      	}
	      else
	      	{
	      		return "failed";
	      	}
    	},
    	"wtManagedRouterGetCPE": function(deviceSerialNo){
    		if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) throw new Meteor.Error(401, "Not authorized"); // Check if calling user is admin
	      var response = WtFriendlyTech.FTCPEStatus(deviceSerialNo);
	      //console.log(response);
	      if (response.FTCPEStatusResult.ErrorCode == 100)
	      	{
	      		var responseData = response.FTCPEStatusResult;
	      		return responseData.Online;
	      	}
	      else
	      	{
	      		return "failed";
	      	}
    	},
    	"wtManagedRouterRebootDevice": function(deviceSerialNo){
    		if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) throw new Meteor.Error(401, "Not authorized"); // Check if calling user is admin
	      var response = WtFriendlyTech.FTRebootDevice(deviceSerialNo);
	      //console.log(response);
	      if (response.FTRebootDeviceResult.ErrorCode == 100)
	      	{
	      		var responseData = response.FTRebootDeviceResult;
	      		return "Id : "+responseData.Id;
	      	}
	      else
	      	{
	      		return "failed";
	      	}
    	},
    	"wtManagedRouterResetToDefault": function(deviceSerialNo){
    		if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) throw new Meteor.Error(401, "Not authorized"); // Check if calling user is admin
	      var response = WtFriendlyTech.FTResetToDefault(deviceSerialNo);
	      //console.log(response);
	      if (response.FTResetToDefaultResult.ErrorCode == 100)
	      	{
	      		var responseData = response.FTResetToDefaultResult;
	      		return "Id : "+responseData.Id;
	      	}
	      else
	      	{
	      		return "failed";
	      	}
    	},
    	"wtManagedGetDeviceParameters": function(deviceSerialNo, names){
    		if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) throw new Meteor.Error(401, "Not authorized"); // Check if calling user is admin
	      var response = WtFriendlyTech.FTGetDeviceParameters(deviceSerialNo, names);
	      //console.log(response);
	      if (response.FTGetDeviceParametersResult.ErrorCode == 100)
	      	{
	      		var responseData = response.FTGetDeviceParametersResult;
	      		var paramWSDL = responseData.Params.ParamWSDL;
	      		var output = "";
	      		for (var i = paramWSDL.length - 1; i >= 0; i--) {
	      			output = paramWSDL[i].Value;
	      		};
	      		return output;
	      	}
	      else
	      	{
	      		return "failed";
	      	}
    	},
    	"wtManagedSetDeviceParameters": function(deviceSerialNo, namesArray, valuesArray){
    		if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) throw new Meteor.Error(401, "Not authorized"); // Check if calling user is admin
	      var arrayParams = new Array();
	      for (var i = 0; i <= namesArray.length - 1; i++) {
	      	var paramObject = {
	      		"Name": namesArray[i],
	      		"Value": valuesArray[i]
	      	};
	      	arrayParams.push(paramObject);
	      };
	      var response = WtFriendlyTech.FTSetDeviceParameters(deviceSerialNo,arrayParams);
	      //console.log(response);
	      if (response.FTSetDeviceParametersResult.ErrorCode == 100)
	      	{
	      		var responseData = response.FTSetDeviceParametersResult;
	      		return "Id : "+responseData.Id;
	      	}
	      else
	      	{
	      		return "failed";
	      	}
    	},
    	"wtGetRouterInfo": function(deviceSerialNo,names){
    		if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) throw new Meteor.Error(401, "Not authorized"); // Check if calling user is admin
	      var namesArray = names.map(function(names) {
				  return names['acs'];
				});
	      var response = WtFriendlyTech.FTGetRouterInfo(deviceSerialNo, namesArray);
	      //console.log(response);
	      if (response.FTGetDeviceParametersResult.ErrorCode == 100)
	      	{
	      		var responseData = response.FTGetDeviceParametersResult;
	      		var paramWSDL = responseData.Params.ParamWSDL;
	      		var output = "";
	      		for (var i = paramWSDL.length - 1; i >= 0; i--) {
	      			output = paramWSDL[i].Value;
	      		};
	      		return paramWSDL;
	      	}
	      else
	      	{
	      		return "failed";
	      	}
    	},
    	"wtGetRouterHosts": function(deviceSerialNo,data){
    		if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) throw new Meteor.Error(401, "Not authorized"); // Check if calling user is admin
    		
    		var count = data.count;
    		var hostCount = WtFriendlyTech.FTGetHostsCount(deviceSerialNo, count);

    		var names = data.items;
    		var namesArray = names.map(function(names) {
    			var str = names['acs'];
    			var requiredPortion = str.split("[X]");
    			var newStr = requiredPortion[0];
    			if(newStr == 'InternetGatewayDevice.LANDevice.1.Hosts.Host.[X].')
    			{
    				return;
    			}
    			else
    			{
    				return newStr;
    			}
        });
				requestData = namesArray.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]); //remove duplicates

	      var response = WtFriendlyTech.FTGetHosts(deviceSerialNo, requestData);
	      console.log(hostCount);
	      console.log(response);
    	}

	});
}
