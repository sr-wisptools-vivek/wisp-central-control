Package.describe({
  name: 'wisptools:managed-router-ui',
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
    'aldeed:collection2@2.3.1',
    'aldeed:autoform@4.2.2',
    'iron:router@1.0.7',
    'wisptools:menu',
    'wisptools:friendly-tech-api'
  ]);
  api.use(['templating'], 'client');
  api.addFiles(['managed-router-ui.js', 'lib/router.js' ], ['server','client']);
// Client only files
  api.addFiles([
    'client/menu.js',
    'client/templates/interface.html',
    'client/templates/tabs.js',
    'client/templates/interface.js',
    'client/templates/connected_devices.html',
    'client/templates/wifi_scan.html',
    'client/templates/router_config.html',
    'client/templates/info.html' 
    ], 'client');  
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('wisptools:managed-router-ui');
  api.addFiles('managed-router-ui-tests.js');
});
