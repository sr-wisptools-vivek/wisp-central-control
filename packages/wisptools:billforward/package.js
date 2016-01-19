Package.describe({
  name: 'wisptools:billforward',
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
    'tinytest',
    'rajit:bootstrap3-datepicker@1.4.1',
    'numeral:numeral@1.5.3',
    'percolate:synced-cron@1.2.1',
    'zimme:bootstrap-growl@2.0.1',
    'wisptools:collection',
    'wisptools:billforward-ui',
    'wisptools:billforward-api'
  ]);
  api.addFiles([
  'billforward.js',
  'lib/collection.js'
  ],['server','client']);

  api.export('WtBillForwardAccounts');
});

Package.onTest(function(api) {
api.use('tinytest');
  api.use('wisptools:billforward');
  api.addFiles('billforward-tests.js');

});
