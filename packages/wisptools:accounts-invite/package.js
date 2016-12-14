Package.describe({
  name: 'wisptools:accounts-invite',
  version: '0.0.1',
  summary: '',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use([
    'meteor',
    'mongo',
    'templating',
    'underscore',
    'iron:router@1.0.7',
    'wisptools:growl',
    'wisptools:collection',
    'wisptools:menu'
  ]);

  api.use('email', ['server']);

  api.addFiles([
    'lib/router.js',
    'lib/collection.js'
    ], ['server','client']);

  api.addFiles([
    'client/menu.js',
    'client/templates/invite.html',
    'client/templates/invite.js',
    'client/templates/accept-invite.html',
    'client/templates/accept-invite.js'
  ], 'client');

  api.addFiles([
    'server/methods.js',
    'server/email.js'
  ], 'server');

});
