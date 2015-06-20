
Template.wtNewInteraction.helpers({
  gotoIdPage: function() {
    Router.go('interactionById', {_id: this._id});
  }
});


Template.wtInteraction.helpers({
  //pages: function () {
  //  return WtInteractionConfig.find({type: "schema", page: this.type}, {sort: {display_order: 1}});
  //},
  templateName: function () {
    for (var i = 0; i < WtInteraction.menu.dropdown.length; i++) {
      if (WtInteraction.menu.dropdown[i].name == this.type) 
        return WtInteraction.menu.dropdown[i].template
    }
    //var row = WtInteractionConfig.findOne({type: "dropdown", name: this.type});
    //return row.template;
  }
});

Template.wtInteractionQuickForm.helpers({
  formId: function () {
    return this.tabId + "_form";    
  }
});

Template.wtInteractionPageWithTabs.helpers({
  name: function () {
    return Template.parentData(3).data.name;
  },
  phone: function () {
    return Template.parentData(3).data.phone;
  },
  title: function () {
    var type = Template.parentData(3).data.type;
    if (type == "sales") return "Sales";
    if (type == "support") return "Support";
    if (type == "service") return "Customer Service";
    return "Interaction";
  },
  tabData: function () {
    return {
      showTitle: false,
      pages: this.pages
    }
  }
});

Template.wtInteraction.rendered = function () {
  // Activate the first tab.
  $('#wt_interaction_tabs a:first').tab('show');
}
