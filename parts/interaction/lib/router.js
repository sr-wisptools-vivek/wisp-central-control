
Router.route('/interaction/sales/new', {
    name: 'newSale', 
    template: 'wtSalesInteraction',
    data: function() {
        var data = wtInteraction.new({type: 'sales'});
        return data;
    }
});

/*
Router.route('/interaction/:_id', {
  name: 'interactionPage',
  data: function() { return Posts.findOne(this.params._id); }
});
*/
