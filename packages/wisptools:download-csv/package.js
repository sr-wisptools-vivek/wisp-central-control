Package.describe({
  name: 'wisptools:download-csv',
  version: '0.0.1',
  // Adds button to download contents of html table.
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
    'templating'
  ]);  
  api.addFiles([
      'download-csv.html', 
      'download-csv.js'
    ], 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('wisptools:download-csv');
  api.addFiles('download-csv-tests.js');
});
