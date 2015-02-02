Template.dashboard.helpers({
  salesInteractions: function () {
    return WtInteraction.find({type: "sales"}).count();
  },
  supportInteractions: function () {
    return WtInteraction.find({type: "support"}).count();
  },
  serviceInteractions: function () {
    return WtInteraction.find({type: "service"}).count();
  },
  totalInteractions: function () {
    return WtInteraction.find().count();
  }
});