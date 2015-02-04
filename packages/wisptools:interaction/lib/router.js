
Router.route('/interaction/new/:name', {
  name: 'newInteraction',
  template: 'wtNewInteraction',
  data: function() {
    return WtInteraction.new({type: this.params.name});
  }
});

Router.route('/interaction/:_id', {
  name: 'interactionById', 
  template: 'wtInteraction',
  data: function() {
    return WtInteraction.findOne(this.params._id);
  }
});
