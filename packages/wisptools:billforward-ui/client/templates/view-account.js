Template.wtViewBfAccount.helpers({

  firstname: function() { return Session.get('profileDetails').firstName},
  lastname: function() { return Session.get('profileDetails').lastName},  
  id: function() { return Session.get('profileDetails').id},
  email: function() { return Session.get('profileDetails').email},
  mobile: function() { return Session.get('profileDetails').mobile},
  address1: function() { return Session.get('profileDetails').addresses[0].addressLine1},
  address2: function() { return Session.get('profileDetails').addresses[0].addressLine2},
  address3: function() { return Session.get('profileDetails').addresses[0].addressLine3},
  city: function() { return Session.get('profileDetails').addresses[0].city},
  province: function() { return Session.get('profileDetails').addresses[0].province},
  postcode: function() { return Session.get('profileDetails').addresses[0].postcode},
  companyname: function() { return Session.get('profileDetails').companyName},
  vatnumber: function() { return Session.get('profileDetails').vatNumber}
});
