Package.describe({
  name: 'wisptools:load-in-modal',
  version: '0.0.1',
  // Load link with href within an iFrame appended on a modal. 
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
    'meteor',
    'jquery'
  ]);
  
  api.addFiles('wisptools:loadinModal.js',['client']);
});
