Package.describe({
  name: 'wisptools:roles',
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
    'alanning:roles',
    'accounts-password',
    'mongo',
    'templating',
    'reactive-var',
    'underscore',
    'iron:router@1.0.7',
    'wisptools:tab-page',
    'rajit:bootstrap3-datepicker@1.4.1',
    'numeral:numeral@1.5.3',
    'percolate:synced-cron@1.2.1',
    'wisptools:growl',
    'wisptools:collection',
    'wisptools:menu'
    
  ]);
  
  api.addFiles([
    
    'lib/router.js'
   
    ], ['server','client']);
    
   api.addFiles([
    'client/menu.js',
    'client/templates/users.html',
    'client/templates/users.js'
    ], 'client');
    
   api.addFiles([
       
       'server/server.js',
       'server/publication.js',
       'server/userMethods.js'
    ], 'server');

    api.addFiles('roles.js');
    api.export('roles');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('wisptools:roles');
  api.addFiles('roles-tests.js');
});
