Package.describe({
  name: 'wisptools:rest-accounts-password',
  version: '0.0.1',
  summary: 'Get a login token to use with simple:rest (Based on simple:rest-accounts-password@1.0.1)',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.addFiles('rest-login.js', "server");
  api.use('accounts-password');
  api.use('simple:json-routes@1.0.1');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('simple:rest-accounts-password');
  api.use('test-helpers');
  api.addFiles('rest-login-tests.js');
});
