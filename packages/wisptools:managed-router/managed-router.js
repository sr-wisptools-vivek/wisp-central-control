// Write your package code here!
if (Meteor.isServer) {
	Meteor.methods({

		  "wtManagedRouterGetInfo": function(deviceSerialNo){
		  	if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) throw new Meteor.Error(401, "Not authorized"); // Check if calling user is admin
	      var response = WtFriendlyTech.FTGetDeviceInfo(deviceSerialNo);
	      //console.log(response);
	      if (response.FTGetDeviceInfoResult.ErrorCode == 100)
	      	{
	      		var responseData = response.FTGetDeviceInfoResult;
	      		return "ManufacturerName : "+responseData.ManufacturerName+" ModelName : "+responseData.ModelName;
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
	      		return "Online : "+responseData.Online;
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
	      			output+= paramWSDL[i].Name+" : "+paramWSDL[i].Value+"<br>";
	      			//paramWSDL[i]
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
    	}

	});
}
