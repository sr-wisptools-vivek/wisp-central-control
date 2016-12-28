Package.describe({
  name: 'wisptools:braintree',
  version: '0.0.1',
  summary: '',
  git: '',
  documentation: 'README.md'
});

Npm.depends({"braintree": "1.46.0"});

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
    'client/templates/settings.html',
    'client/templates/settings.js'
  ], 'client');

  api.addFiles([
    'server/methods.js',
    'server/braintree.js'
  ], 'server');

  api.export('BraintreeAPI');

});
