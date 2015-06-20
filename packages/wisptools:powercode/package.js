Package.describe({
  name: 'wisptools:powercode',
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
    'aldeed:collection2@2.3.1',
    'aldeed:autoform@4.2.2',
    'iron:router@1.0.7',
    'wisptools:menu',
    'wisptools:date-format'    
  ]);

  // Client and server files
  api.addFiles([
    'lib/wtpowercode.js'
    ], ['server','client']);

  api.addFiles([
    'server/methods.js'
    ], 'server');

  api.export('WtPowercode');

});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('wisptools:powercode');
  api.addFiles('wisptools:powercode-tests.js');
});

Npm.depends({
  'mysql': '2.6.2'
});
