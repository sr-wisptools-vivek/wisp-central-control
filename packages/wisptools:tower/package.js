Package.describe({
  name: 'wisptools:tower',
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
  api.versionsFrom('1.0.3.1');

  api.use([
    'meteor',
    'mongo',
    'templating',
    'aldeed:collection2@2.3.1',
    'aldeed:autoform@4.2.2',
    'iron:router@1.0.7',
    'wisptools:map-control',
    'wisptools:collection',
    'zimme:bootstrap-growl@2.0.1',
    'mrt:jquery-mousewheel',
    'natestrauser:bootstrap-colorpicker'
  ]);

  // Client and Server files
  api.addFiles([
    'lib/collection.js',
    'lib/router.js'
    ], ['server','client']);

  // Client only files
  api.addFiles([
    'client/css/animate.css',
    'client/css/growl.css',
    'client/css/style.css',
    'client/css/bootstrap-modal-carousel.min.css',
    'client/css/jquery.simplecolorpicker.css',
    'client/css/jquery.simplecolorpicker-fontawesome.css',
    'client/css/jquery.simplecolorpicker-glyphicons.css',
    'client/css/jquery.simplecolorpicker-regularfont.css',
    'client/js/bootstrap-modal-carousel.min.js',
    'client/js/jquery.simplecolorpicker.js',
    'client/templates/side_menu.html',
    'client/templates/side_menu.js',
    'client/templates/access_point.html',
    'client/templates/access_point.js',
    'client/templates/edit_form.html',
    'client/templates/edit_form.js',
    'client/templates/map.html',
    'client/templates/map.js'
    ], 'client');

  api.export('WtTower');
  api.export('ManagedRouter', 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('wisptools:tower');
  api.addFiles('wisptools:tower-tests.js');
});
