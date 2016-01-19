if (Meteor.isClient){

	Template.registerHelper("log", function(something) {
  	console.log(something);
	});


	Template.wtEditBfAccounts.helpers({
		accountId: function(){

			return Session.get('selectedAccount');

		},
		accountData: function(accountId){
			 console.log(accountId);
			Meteor.call("getSingleBillForwardAcount", accountId, function(err,response){
				if(err) {
						console.log("Error:" + err.reason);
						return;
					}
				if(response != 'failed')
				{
				  console.log(response);
				  Session.set('proileData', response.details);
				  //return response.details;					  
				}
				else
				{
					$.growl({
							icon: 'glyphicon glyphicon-warning-sign',
							message: 'Failed to create account. Please try again'
						},{
							type: 'danger'
						});
				}

			});
		},
		displayForm: function(){
			return Session.get("proileData");
		},
	  firstName:function(){
	  	if(Session.get('proileData'))
	  	{
	  		return Session.get('proileData').firstName;
	  	} 
	  },
	  lastName:function(){
	  	if(Session.get('proileData'))
	  	{
	  		return Session.get('proileData').lastName;
	  	} 
	  },
	  email:function(){
	  	if(Session.get('proileData'))
	  	{
	  		return Session.get('proileData').email;
	  	} 
	  },
	  mobile:function(){
	  	if(Session.get('proileData'))
	  	{
	  		return Session.get('proileData').mobile;
	  	} 
	  },
	  companyName:function(){
	  	if(Session.get('proileData'))
	  	{
	  		return Session.get('proileData').companyName;
	  	} 
	  },
	  vatNumber:function(){
	  	if(Session.get('proileData'))
	  	{
	  		return Session.get('proileData').vatNumber;
	  	} 
	  }
	});

	Template.wtEditBfAccounts.events({
		
		'submit form': function (event) {
			event.preventDefault();
			//alert("submit clicked");
			var id = document.querySelector("[name='accountId']").value;
			var firstName = document.querySelector("[name='firstName']").value;
			var lastName = document.querySelector("[name='lastName']").value;
			var email = document.querySelector("[name='email']").value;
			var phone = document.querySelector("[name='phone']").value;
			var address = document.querySelector("[name='address']").value;
			if(document.querySelector("[name='address2']"))
			{
			  var address2 = document.querySelector("[name='address2']").value;
			}
		  if(document.querySelector("[name='address3']"))
		  {
		    var address3 = document.querySelector("[name='address3']").value;
		  }
		  var city = document.querySelector("[name='city']").value;
		  var province = document.querySelector("[name='province']").value;
		  var postcode = document.querySelector("[name='postcode']").value;
			var companyName = document.querySelector("[name='companyName']").value;
			var taxNo = document.querySelector("[name='taxNo']").value;
			
			var new_account ={

					"email": email,
					"firstName"	: firstName,
					"lastName"	: lastName,
					"landline"	: "",
					"mobile"	: phone,
					"dob"		: "",
					"addresses"	: [
					  {
						"addressLine1": address,
						"addressLine2": address2,
						"addressLine3": address3,
						"city": city,
						"province": province,
						"country": "",
						"postcode": postcode,
						"landline": "",
						"primaryAddress": true
					  }],
					"companyName": companyName,
					"vatNumber": taxNo,
					"logoURL": "https://app-sandbox.billforward.net/resources/images/normal_logo.png",
					"deleted": false,
					"additionalInformation": ""
			};
				
		  Meteor.call('updateBillForwardAcount', new_account, id, function(err,response) {
				if(err) {
					console.log("Error:" + err.reason);
					return;
				}
				if(response != 'failed')
				{
				  console.log(response);
				  Router.go('/bf/account/accounts');
				  //Session.set('profileDetails', response.data.results[0].profile);
					$.growl({
							icon: 'glyphicon glyphicon-ok',
							message: 'Account Updated successfully'
						},{
							type: 'success'
						});
				}
				else
				{
					console.log(response);
					$.growl({
							icon: 'glyphicon glyphicon-warning-sign',
							message: 'Failed to update account. Please try again'
						},{
							type: 'danger'
						});
				}
			});
			return false;
		}
	});
}