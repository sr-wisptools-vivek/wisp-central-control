Package.describe({
  name: 'wisptools:editable-field',
  version: '0.0.1',
  summary: 'On hover over editable fields, show a "pencil" icon next to field when hovering.',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.2');
  api.use([
    'meteor',
    'templating',
    'jquery',
  ]);
  api.addFiles(['css/editableField.css','icon.html'],'client');
  api.addFiles('wisptools:editableField.js','client');
  api.export('WtEditableField');
});
