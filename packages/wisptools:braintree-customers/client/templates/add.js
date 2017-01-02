Template.wtBraintreeCustomersAdd.events({
  'click .addCustomer': function (e) {
    e.preventDefault();
    var firstname = $('#firstname').val();
    var lastname = $('#lastname').val();
    var phone = $('#phone').val();
    var email = $('#email').val();
    var address = $('#address').val();
    var city = $('#city').val();
    var state = $('#state').val();
    var zip = $('#zip').val();
    if (!firstname || !lastname || !phone || !email || !address || !city || !state || !zip) {
      WtGrowl.fail('Please fill all the fields.');
    } else if (!Accounts._loginButtons.validateEmail(email)) {
      WtGrowl.fail('Please enter a valid email.');
    } else {
      Meteor.call('wtBraintreeAPIAddCustomer', firstname, lastname, phone, email, address, city, state, zip, function (err, res) {
        if (err) {
          console.log(err);
          WtGrowl.fail('Failed to create a new customer.');
        } else {
          Meteor.call('wtBraintreeCustomerAddCustomer', res.id, firstname, lastname, phone, email, address, city, state, zip, function (e, r) {
            if (e) {
              console.log(e);
              WtGrowl.fail('Failed to save new customer details.');
            } else {
              WtGrowl.success('Created a new customer.');
              Router.go('wtBraintreeCustomers');
            }
          });
        }
      });
    }
  }
});
