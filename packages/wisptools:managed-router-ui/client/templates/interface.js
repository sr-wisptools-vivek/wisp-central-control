if(Meteor.isClient){

Template.wtFriendlyTechInterface.helpers({
	CPEStatus: function(){

		Meteor.call('wtManagedRouterGetInfo', "RNV5000511", function(err,response) {
		if(err) {
			console.log("Error:" + err.reason);
			return;
		}
		if(response == "true")
		{
		  return '<button type="button" class="btn btn-success btn-xs">Online</button>';
		}
		else
		{
			return '<button type="button" class="btn btn-danger btn-xs">Status not available</button>';
		}
	});

	}
});

Template.wtFriendlyTechInterface.events({

});

}
