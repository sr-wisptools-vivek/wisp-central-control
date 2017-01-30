Template.wtBraintreeCustomersAdd.events({
  'click .addCustomer': function (e) {
    e.preventDefault();
    var firstname = $('#firstname').val();
    var lastname = $('#lastname').val();
    var companyname = $('#companyname').val();
    var phone = $('#phone').val();
    var email = $('#email').val();
    var address = $('#address').val();
    var city = $('#city').val();
    var state = $('#state').val();
    var zip = $('#zip').val();
    if (!email) {
      WtGrowl.fail('Email field is required.');
    } else if (!(!!firstname && !!lastname) && !companyname) {
      WtGrowl.fail('Either the Company name or the First name and Last name is required.');
    } else if (!Accounts._loginButtons.validateEmail(email)) {
      WtGrowl.fail('Please enter a valid email.');
    } else {
      Meteor.call('wtBraintreeAPIAddCustomer', firstname, lastname, companyname, phone, email, address, city, state, zip, function (err, res) {
        if (err) {
          console.log(err);
          WtGrowl.fail('Failed to create a new customer.');
        } else {
          Meteor.call('wtBraintreeCustomerAddCustomer', res.customer.id, res.address.address.id, firstname, lastname, companyname, phone, email, address, city, state, zip, function (e, r) {
            if (e) {
              console.log(e);
              WtGrowl.fail('Failed to save new customer details.');
            } else {
              WtGrowl.success('Created a new customer.');
              Router.go('wtBraintreeEditCustomer', {id: r});
            }
          });
        }
      });
    }
  }
});
