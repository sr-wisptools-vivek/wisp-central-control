Router.route('/interaction/sales/new', {
	name: 'newSale',
	template: 'wtNewInteraction',
	data: function() {
		return WtInteraction.new({type: 'sales'});
	}
});

Router.route('/interaction/:_id', {
    name: 'interactionById', 
    template: 'wtInteraction',
    data: function() {
        return WtInteraction.findOne(this.params._id);
    }
});

/*
Router.route('/interaction/:_id', {
  name: 'interactionPage',
  data: function() { return Posts.findOne(this.params._id); }
});
*/
