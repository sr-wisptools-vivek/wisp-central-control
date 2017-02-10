Package.describe({
  name: 'wisptools:free-router',
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
    'underscore',
    'reactive-var',
    'iron:router@1.0.7',
    'stratogee:relative-time@1.0.0',
    'wisptools:growl',
    'wisptools:menu',
    'wisptools:collection',
    'wisptools:ui-address',
  ]);

  api.addFiles([
    'lib/router.js',
    'lib/collection.js',
    ], ['server','client']);

  api.addFiles([
    'client/form.html',
    'client/form.js',
    'client/list.html',
    'client/list.js',
    'client/details.html',
    'client/details.js',
    'client/menu.js',
  ], 'client');

  api.export('WtFreeRouter');

});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('wisptools:free-router');
  api.addFiles('free-router-tests.js');
});
