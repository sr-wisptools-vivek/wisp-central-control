Package.describe({
  name: 'wisptools:braintree-customers',
  version: '0.0.1',
  summary: '',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use([
    'meteor',
    'mongo',
    'templating',
    'underscore',
    'iron:router@1.0.7',
    'wisptools:growl',
    'wisptools:collection',
    'wisptools:menu',
    'wisptools:aes'
  ]);

  api.addFiles([
    'lib/router.js',
    'lib/collection.js'
    ], ['server','client']);

  api.addFiles([
    'client/menu.js',
    'client/templates/customers.html',
    'client/templates/customers.js',
    'client/templates/add.html',
    'client/templates/add.js',
    'client/templates/customer-edit.html',
    'client/templates/customer-edit.js',
    'client/templates/braintree-form.html',
    'client/templates/braintree-form.js',
    'client/templates/braintree-edit-form.html',
    'client/templates/braintree-edit-form.js'
  ], 'client');

  api.addFiles([
    'server/methods.js'
  ], 'server');

});
