Package.describe({
  name: 'wisptools:menu',
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
    'templating',
    'iron:router@1.0.7',
    'reactive-var'
  ]);

  api.addFiles([
    'lib/wtmenu.js'
    ], ['server','client']);

  // Client only files
  api.addFiles([
    'client/templates/menu.html',
    'client/templates/menu.js'
    ], 'client');

  api.export('WtMenu');

});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('wisptools:menu');
  api.addFiles('wisptools:menu-tests.js');
});
