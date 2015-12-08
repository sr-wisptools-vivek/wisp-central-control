// Write your package code here!
if (Meteor.isServer) {
	Meteor.methods({

		  "wtManagedRouterGetInfo": function(username, fullname, telephone){
	      console.log(username);
	      var response = WtFriendlyTech.FTGetDeviceInfo(username, fullname, telephone);
	      console.log(response);
    	}

	});
}