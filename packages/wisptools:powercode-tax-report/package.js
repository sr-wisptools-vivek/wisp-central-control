Package.describe({
  name: 'wisptools:powercode-tax-report',
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
    'reactive-var',
    'iron:router@1.0.7',
    'rajit:bootstrap3-datepicker@1.4.1',
    'numeral:numeral@1.5.3',
    'wisptools:menu',
    'wisptools:powercode',
    'wisptools:download-csv',
    'wisptools:date-format',
    'wisptools:progress-bar'
  ]);

  // Client and Server files
  api.addFiles([
    'lib/router.js'
    ], ['server','client']);

  // Client only files
  api.addFiles([
    'client/menu.js',
    'client/templates/report.html',
    'client/templates/report.js'
    ], 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('wisptools:powercode-tax-report');
  api.addFiles('powercode-tax-report-tests.js');
});
