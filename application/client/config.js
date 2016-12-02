Accounts.ui.config({
  passwordSignupFields: 'EMAIL_AND_LEGACY_USERNAME'
});

Accounts.ui.config({
  extraSignupFields: [{
    fieldName: 'domain',
    fieldLabel: 'Domain',
    inputType: 'text',
    visible: true,
    validate: function(value, errorFunction) {
      if (!value || (value && value.trim().length<1)) {
        errorFunction("Please provide a valid domain.");
        return false;
      } else if (value.trim().indexOf(" ") > -1) {
        errorFunction("Domain name should not contain spaces.");
      } else {
        return true;
      }
    }
  }]
});
