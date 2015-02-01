/*
Template.wtInteractionInputField.helpers({
  collection: 'wt_interactions',
  substitute: '<i class="fa fa-pencil"></i>'
});

Template.wtInteractionInputField.collection = 'wt_interactions';
Template.wtInteractionInputField.substitute = '<i class="fa fa-pencil"></i>';
*/

Template.wtInteractionInputField.helpers({
  options: function () {
    return {
      context: this.context,
      collection: 'wt_interactions',
      substitute: '<i class="fa fa-pencil"></i>',
      field: this.field,
    };
  }
});