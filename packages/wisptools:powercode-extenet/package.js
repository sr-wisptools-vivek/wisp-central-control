Package.describe({
  name: 'wisptools:powercode-extenet',
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
  api.versionsFrom('1.1.0.2');

  api.use([
    'meteor',
    'mongo',
    'templating',
    'reactive-var',
    'iron:router@1.0.7',
    'wisptools:collection',
    'wisptools:menu',
    'wisptools:powercode',
    'wisptools:tab-page',
    'wisptools:growl'
  ]);

  // Client and Server files
  api.addFiles([
    'lib/collection.js',
    'lib/router.js'
    ], ['server','client']);

  // Client only files
  api.addFiles([
    'client/menu.js',
    'client/templates/main.html',
    'client/templates/main.js',
    'client/templates/api.html',
    'client/templates/api.js',
    'client/templates/services.html',
    'client/templates/services.js',
    'client/templates/sim_cards.html',
    'client/templates/sim_cards.js',
    ], 'client');

  api.export('WtPowercodeExtenet');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('wisptools:powercode-extenet');
  api.addFiles('powercode-extenet-tests.js');
});
