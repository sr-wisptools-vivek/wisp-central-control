Package.describe({
  name: 'wisptools:aes',
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
  api.versionsFrom('1.2.1');
  api.use([
    'altapp:aes@1.2.0'
  ]);
  api.addFiles('aes.js', 'server');
  api.export('WtAES', 'server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('wisptools:aes');
  api.addFiles('aes-tests.js');
});
