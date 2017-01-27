Template.wtBraintreeEditPaymentMethodForm.onRendered(function () {
  Meteor.call('wtBraintreeCustomerGetCustomer', this.data.id, function (e, r) {
    if (r) {
      var braintreeCustomer = r;
      if (braintreeCustomer) {
        Meteor.call('wtBraintreeAPICreateClientToken', function (e,r) {
          if (r && r.status=="success") {
            initPaymentForm(r.data, braintreeCustomer.customerId);
          } else {
            WtGrowl.fail('An error has occurred');
          }
        });
      } else {
        WtGrowl.fail('An error has occurred');
      }
    } else {
      WtGrowl.fail('An error has occurred');
    }
  });
});

function initPaymentForm(authorization, customerId) {
  var token = Session.get('braintreeEditPaymentMethod');
  if (token) {
    braintree.client.create({
      authorization: authorization
    }, function (err, clientInstance) {
      if (err) {
        console.log(err);
        return;
      }

      braintree.hostedFields.create({
        client: clientInstance,
        styles: {
          'input': {
            'font-size': '14px',
            'font-family': 'helvetica, tahoma, calibri, sans-serif',
            'color': '#3a3a3a'
          },
          ':focus': {
            'color': 'black'
          }
        },
        fields: {
          number: {
            selector: '#edit-card-number',
            placeholder: '4111 1111 1111 1111'
          },
          cvv: {
            selector: '#edit-cvv',
            placeholder: '123'
          },
          expirationMonth: {
            selector: '#edit-expiration-month',
            placeholder: 'MM'
          },
          expirationYear: {
            selector: '#edit-expiration-year',
            placeholder: 'YY'
          }
        }
      }, function (err, hostedFieldsInstance) {
        if (err) {
          console.log(err);
          return;
        }

        hostedFieldsInstance.on('validityChange', function (event) {
          var field = event.fields[event.emittedBy];

          if (field.isValid) {
            if (event.emittedBy === 'expirationMonth' || event.emittedBy === 'expirationYear') {
              if (!event.fields.expirationMonth.isValid || !event.fields.expirationYear.isValid) {
                return;
              }
            } else if (event.emittedBy === 'number') {
              $('#edit-card-number').next('span').text('');
            }

            // Apply styling for a valid field
            $(field.container).parents('.form-group').addClass('has-success');
          } else if (field.isPotentiallyValid) {
            // Remove styling  from potentially valid fields
            $(field.container).parents('.form-group').removeClass('has-warning');
            $(field.container).parents('.form-group').removeClass('has-success');
            if (event.emittedBy === 'number') {
              $('#edit-card-number').next('span').text('');
            }
          } else {
            // Add styling to invalid fields
            $(field.container).parents('.form-group').addClass('has-warning');
            // Add helper text for an invalid card number
            if (event.emittedBy === 'number') {
              $('#edit-card-number').next('span').text('Looks like this card number has an error.');
            }
          }
        });

        hostedFieldsInstance.on('cardTypeChange', function (event) {
          // Handle a field's change, such as a change in validity or credit card type
          if (event.cards.length === 1) {
            $('#edit-card-type').text(event.cards[0].niceType);
          } else {
            $('#edit-card-type').text('Card');
          }
        });

        $('#edit-payment-method-form').submit(function (event) {
          event.preventDefault();
          hostedFieldsInstance.tokenize(function (err, payload) {
            if (err) {
              WtGrowl.fail(err.message);
              return;
            }

            var cardholderName = $('#edit-cardholder-name').val();

            Meteor.call('wtBraintreeAPIUpdatePaymentMethod', token, payload.nonce, cardholderName, function (e, r) {
              if (e) {
                WtGrowl.fail('Failed to update payment method.');
              } else {
                Meteor.call('wtBraintreeAPIGetCustomer', customerId, function (e, r) {
                  if (!e) {
                    if (r && r.status=='success') {
                      Session.set('braintreeAPICustomer', r.data);
                    }
                  }
                });
                Session.set('braintreeEditPaymentMethod', false);
                WtGrowl.success('Payment method updated.');
              }
            });
          });
        });
      });
    });
  } else {
    WtGrowl.fail("An error has occurred");
  }
}
