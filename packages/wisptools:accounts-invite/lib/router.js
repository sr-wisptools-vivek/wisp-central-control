Router.route('/accounts-invite', {
  name: 'wtAccountsInviteInvite',
  template: 'wtAccountsInviteInvite'
});

Router.route('/invite/:token', {
  name: 'wtAccountsInviteCreateAccount',
  template: 'wtAccountsInviteCreateAccount',
  data: function () {
    return {token: this.params.token};
  }
});
