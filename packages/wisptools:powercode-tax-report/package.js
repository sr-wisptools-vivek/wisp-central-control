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
    'percolate:synced-cron@1.2.1',
    'wisptools:menu',
    'wisptools:collection',
    'wisptools:powercode',
    'wisptools:download-csv',
    'wisptools:date-format',
    'wisptools:progress-bar',
    'wisptools:nodemailer'
  ]);

  // Client and Server files
  api.addFiles([
    'lib/collection.js',
    'lib/router.js'
    ], ['server','client']);

  // Client only files
  api.addFiles([
    'client/menu.js',
    'client/templates/main.html',
    'client/templates/main.js',
    'client/templates/email.html',
    'client/templates/email.js',
    'client/templates/report.html',
    'client/templates/report.js'
    ], 'client');

  // Server only files
  api.addFiles([
    'server/cron.js'
    ], ['server']);

  api.export('WtPowercodeTaxReport');  
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('wisptools:powercode-tax-report');
  api.addFiles('powercode-tax-report-tests.js');
});

Npm.depends({
  'json-2-csv': '1.3.0'
});
