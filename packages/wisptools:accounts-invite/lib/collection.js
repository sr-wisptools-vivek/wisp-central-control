WtAccountsInviteTokens = new WtCollection('wt_accounts_invite_tokens', {
  update: {
    roles: ['customer', 'domain-admin'],
    fields: ['accepted']
  }
});
