Package.describe({
  name: 'wisptools:customer',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.1');
  api.use([
    'meteor',
    'mongo',
    'templating',
    'aldeed:collection2@2.3.1',
    'aldeed:autoform@4.2.2',
    'iron:router@1.0.7'
  ]);

  // Client and Server files
  api.addFiles([
    'lib/collection.js'
    ], ['server','client']);

  // Server only files
  api.addFiles([
    'server/publish.js'
    ], 'server');

  // Client only files
  api.addFiles([
    'client/subscribe.js',
    'client/templates/customer.html',
    'client/templates/customer.js'
    ], 'client');

  api.export('WtCustomer');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('wisptools:customer');
  api.addFiles('wisptools:customer-tests.js');
});
