Package.describe({
  name: 'wisptools:manage-domain-users',
  version: '0.0.1',
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
    'wisptools:menu',
    'wisptools:growl',
    'wisptools:collection',
    'wisptools:roles'
  ]);

  api.addFiles([
    'lib/router.js'
  ], ['client', 'server']);

  api.addFiles([
    'client/menu.js',
    'client/templates/manage-domain-users.html',
    'client/templates/manage-domain-users.js'
  ], 'client');

  api.addFiles([
    'server/methods.js'
  ], 'server');

});
