if (Meteor.isClient){

  Template.wtBillForwardAddress.helpers({
		displayAdd2: function (add2, add3) {
			return (add2 || add3 || Session.get('mdAddressDisplayAdd2')|| Session.get('proileData').addresses[0].addressLine2);
		},
		displayAdd3: function (add3) {
			return (add3 || Session.get('mdAddressDisplayAdd3')|| Session.get('proileData').addresses[0].addressLine3);
		},
	  address1:function(){
	  	if(Session.get('proileData'))
	  	{
	  		return Session.get('proileData').addresses[0].addressLine1;
	  	} 
	  },
	  address2:function(){
	  	if(Session.get('proileData'))
	  	{
	  		return Session.get('proileData').addresses[0].addressLine2;
	  	} 
	  },
	  address3:function(){
	  	if(Session.get('proileData'))
	  	{
	  		return Session.get('proileData').addresses[0].addressLine3;
	  	} 
	  },
	  city:function(){
	  	if (Session.get('proileData'))
	  	{
	  		return Session.get('profileData').addresses[0].city;
	  	}
	  },
	  province:function(){
	  	if (Session.get('profileData'))
	  	{
	  		return Session.get('proileData').addresses[0].province;
	  	}
	  },
	  postcode:function(){
	  	if(Session.get('profileData'))
	  	{
	  		return Session.get('profileData').addresses[0].postcode;
	  	}
	  }
	});
	Template.wtBillForwardAddress.events({
		'click .add2ndLine': function () {
			Session.set('mdAddressDisplayAdd2', true);
		},
		'click .add3rdLine': function () {
			Session.set('mdAddressDisplayAdd3', true);
		}
	});
	Template.wtBillForwardAddress.onRendered(function () {
		Session.set('mdAddressDisplayAdd2', false);
		Session.set('mdAddressDisplayAdd3', false);
	});
}