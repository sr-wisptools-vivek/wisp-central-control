Package.describe({
  name: 'wisptools:powercode-commission',
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
  api.versionsFrom('1.0.3.2');

  api.use([
    'meteor',
    'mongo',
    'templating',
    'reactive-var',
    'aldeed:collection2@2.3.1',
    'aldeed:autoform@4.2.2',
    'iron:router@1.0.7',
    'wisptools:menu',
    'wisptools:powercode',
    'wisptools:tab-page'
  ]);

  // Client and Server files
  api.addFiles([
    'lib/router.js'
    ], ['server','client']);

  // Client only files
  api.addFiles([
    'client/menu.js',
    'client/templates/main.html',
    'client/templates/main.js',
    'client/templates/reports.html',
    'client/templates/reports.js',
    'client/templates/services.html',
    'client/templates/services.js',
    'client/templates/types.html',
    'client/templates/types.js',
    'client/templates/users.html',
    'client/templates/users.js'
    ], 'client');

});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('wisptools:powercode-commission');
  api.addFiles('wisptools:powercode-commission-tests.js');
});
