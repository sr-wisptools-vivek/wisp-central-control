Package.describe({
  name: 'wisptools:interaction',
  version: '0.0.1',
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
    'babrahams:editable-text@0.7.6'
  ]);
  api.addFiles('server/publication.js', 'server');
  api.addFiles([
    'client/subscription.js',
    'client/template.html',
    'client/template.js'
    ], 'client');
  api.addFiles('lib/collection.js', ['server','client']);
  api.export('WtInteraction');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('wisptools:interaction');
  api.addFiles('wisptools:interaction-tests.js');
});
