Package.describe({
  name: 'wisptools:friendly-tech-api',
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
  api.use('zardak:soap');
  api.addFiles(['friendly-tech-api.js', 'server/api.js', 'server/functions.js'],'server');
  api.export('WtFriendlyTech');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('wisptools:friendly-tech-api');
  api.addFiles('friendly-tech-api-tests.js');
});
