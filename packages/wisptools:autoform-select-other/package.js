Package.describe({
  name: 'wisptools:autoform-select-other',
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
  api.versionsFrom('1.0.3.2');
  api.use([
    'templating',
    'aldeed:autoform@4.2.2'
  ]);
  api.addFiles([
    'autoform_select_other.html',
    'autoform_select_other.js'
  ], ['client']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('wisptools:autoform-select-other');
  api.addFiles('wisptools:autoform-select-other-tests.js');
});
