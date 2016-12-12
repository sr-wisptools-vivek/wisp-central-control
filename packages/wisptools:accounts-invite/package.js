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

  api.addFiles([
    'lib/router.js'
    ], ['server','client']);

  api.addFiles([
    'client/menu.js',
    'client/templates/invite.html',
    'client/templates/invite.js'
  ], 'client');

  api.addFiles([

  ], 'server');

});
