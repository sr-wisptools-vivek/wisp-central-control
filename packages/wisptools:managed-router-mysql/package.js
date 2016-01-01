Package.describe({
  name: 'wisptools:managed-router-mysql',
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
    'underscore',
    'iron:router@1.0.7',
    'jparker:crypto-md5@0.1.1',
    'simple:rest@0.2.3',
    'wisptools:menu',
    'wisptools:growl',
    'wisptools:collection',
    'wisptools:roles'
  ]);

  api.addFiles([
    'lib/router.js',
    'lib/collection.js'
  ], ['client', 'server']);

  api.addFiles([
    'client/domains.html',
    'client/domains.js',
    'client/list.html',
    'client/list.js',
    'client/menu.js'
  ], 'client');

  api.addFiles([
    'server/server.js',
    'server/methods.js',
  ], 'server');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('wisptools:managed-router-mysql');
  api.addFiles('managed-router-mysql-tests.js');
});

Npm.depends({
  'mysql': '2.6.2'
});

