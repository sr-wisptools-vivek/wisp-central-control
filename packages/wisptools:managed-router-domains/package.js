Package.describe({
  name: 'wisptools:managed-router-domains',
  version: '0.0.1',
  // Manage domains, provide edit and delete options
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
    'wisptools:roles',
    'wisptools:editable-field'
  ]);

  api.addFiles([
    'lib/router.js',
    'lib/collection.js'
  ], ['client', 'server']);

  api.addFiles([
    'client/templates/managedomains.html',
    'client/templates/managedomains.js',
    'client/menu.js'
  ], 'client');
  
  api.addFiles([
    'server/methods.js'
  ], 'server');
  
  api.export('WtMangedRouterMySQLDomainsList');
});


