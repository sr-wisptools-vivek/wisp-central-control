Template.wtFreeRouterDetails.helpers({
  item: function() {
    return WtFreeRouter.findOne({ _id: Template.instance().data.itemId });
  },
  notEquals: function (a, b) {
    return a !== b;
  },
  yesOrNo: function (test) {
    return test ? "Yes" : "No";
  }
});

Template.wtFreeRouterDetails.events({
  'click .mark-shipped': function(e, t) {
    e.preventDefault();
    e.stopPropagation();
    WtFreeRouter.update({'_id':t.data.itemId},{$set:{'status':'Shipped'}});
    WtGrowl.success('Record Updated');
  }
})