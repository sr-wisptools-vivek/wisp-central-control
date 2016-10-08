Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});

// forcing username field to say Email...
// need to figure out how to convert to real email login.
accountsUIBootstrap3.map('en', {
    signupFields: {
      username: "Email"
    },
    loginFields: {
      username: "Email"
    }
});
