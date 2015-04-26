Package.describe({
  name: 'wisptools:delete-btn',
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
    'mizzao:bootboxjs@4.4.0',
    'dburles:mongo-collection-instances'
  ]);

  api.addFiles([
    'delete-btn.html',
    'delete-btn.js'
  ]);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('wisptools:delete-btn');
  api.addFiles('delete-btn-tests.js');
});
