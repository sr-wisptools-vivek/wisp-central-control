
Template.wtNewInteraction.helpers({
  gotoIdPage: function() {
    Router.go('interactionById', {_id: this._id});
  }
});