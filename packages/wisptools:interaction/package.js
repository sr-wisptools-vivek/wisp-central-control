Package.describe({
  name: 'wisptools:interaction',
  version: '0.0.4',
  // Brief, one-line summary of the package.
  summary: 'Managed the wt_interactions collection for the WISP Tools interface',
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
    'iron:router@1.0.7',
    'wisptools:customer',
    'wisptools:collection'
  ]);

  // Client and Server files
  api.addFiles([
    'lib/collection.js',
    'lib/router.js',
    'lib/config.js'
    ], ['server','client']);

  // Client only files
  api.addFiles([
    'client/css/style.css',
    'client/templates/menu.html',
    'client/templates/menu.js',
    'client/templates/sales.html',
    'client/templates/sales.js',
    'client/templates/support.html',
    'client/templates/support.js',
    'client/templates/service.html',
    'client/templates/service.js',
    'client/templates/base.html',
    'client/templates/base.js'
    ], 'client');

  api.export('WtInteraction');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('wisptools:interaction');
  api.addFiles('wisptools:interaction-tests.js');
});
