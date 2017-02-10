Template.wtFreeRouterDetails.helpers({
  item: function() {
    return WtFreeRouter.findOne({ _id: Template.instance().data.itemId });
  },
});