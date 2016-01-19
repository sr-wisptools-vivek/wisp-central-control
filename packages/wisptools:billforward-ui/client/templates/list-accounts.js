if (Meteor.isClient){

  Template.wtListBfAccounts.created=function () { Meteor.call('getBillForwardAcounts', function(err,response) {
		  if(err) {
			  console.log("Error:" + err.reason);
			  return;
		  }
		  if(response)
		  {
		    console.log(response.data.results);
		    //return response.data.results;
		    Session.set('accountDetails', response.data.results);
		  }

	  });
		}
  Template.wtListBfAccounts.accountDetails=function(){ return Session.get("accountDetails");}

  Template.wtListBfAccounts.helpers({
  	displayTable: function(){
			return Session.get('accountDetails');
		}
  });
  Template.registerHelper('arrayify',function(obj){
    result = [];
    for (var key in obj) result.push({name:key,value:obj[key]});
    	console.log(result);
    return result;
	});

	Template.wtListBfAccounts.events({
		'click .edit_button': function(event){

			var selectedAccount = event.target.value;
			//alert(selectedAccount);
			Session.set('selectedAccount', selectedAccount);
			delete Session.keys['proileData'];
			//console.log(Session.get("selectedAccount"));
			//Session.set('proileData',"");
			Router.go('/bf/account/edit');
		}
	});
	
	Template.wtListBfAccounts.onRendered({});
}