Package.describe({
  name: 'wisptools:interaction',
  version: '0.0.3',
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
    'aldeed:autoform@4.2.2'
  ]);

  // Client and Server files
  api.addFiles([
    'lib/collection.js',
    'lib/schema.js'
    ], ['server','client']);

  // Server only files
  api.addFiles([
    'server/publication.js',
    'server/fixture.js'
    ], 'server');

  // Client only files
  api.addFiles([
    'client/subscription.js',
    'client/template.html',
    'client/template.js',
    'client/menu.html',
    'client/menu.js'
    ], 'client');

  api.export('WtInteraction');
  api.export('schema');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('wisptools:interaction');
  api.addFiles('wisptools:interaction-tests.js');
});
