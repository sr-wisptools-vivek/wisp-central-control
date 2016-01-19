if(Meteor.isClient){

Template.wtCreateBfAccount.events({

'submit form': function (event) {
	event.preventDefault();
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
		"profile": 
		  {
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
  		}
	};
		
  Meteor.call('createBillForwardAcount', new_account, function(err,response) {
		if(err) {
			console.log("Error:" + err.reason);
			return;
		}
		if(response != 'failed')
		{
		  console.log(response.data.results[0].profile);
		  Router.go('/bf/account/view');
		  Session.set('profileDetails', response.data.results[0].profile);
			$.growl({
					icon: 'glyphicon glyphicon-ok',
					message: 'Account Created successfully'
				},{
					type: 'success'
				});
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
	return false;
	}
});

}
