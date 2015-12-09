// Write your package code here!
if (Meteor.isServer) {
	Meteor.methods({

		  "wtManagedRouterGetInfo": function(deviceSerialNo){
	      //console.log(username);
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
	      //console.log(username);
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
	      //console.log(username);
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
	      //console.log(username);
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
    	"wtManagedGetDeviceParameters": function(deviceSerialNo){
	      //console.log(username);
	      var response = WtFriendlyTech.FTGetDeviceParameters(deviceSerialNo);
	      //console.log(response);
	      if (response.FTGetDeviceParametersResult.ErrorCode == 100)
	      	{
	      		var responseData = response.FTGetDeviceParametersResult;
	      		return "Params : "+responseData.Params.ParamWSDL.Value;
	      	}
	      else
	      	{
	      		return "failed";
	      	}
    	}

	});
}
