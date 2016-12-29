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
    } else {
      Meteor.call('wtBraintreeAPIAddCustomer', firstname, lastname, phone, email, address, city, state, zip, function (err, res) {
        if (err) {
          WtGrowl.fail('Failed to create a new customer.');
          console.log(err);
        } else {
          WtGrowl.success('Created a new customer.');
        }
      });
    }
  }
});
