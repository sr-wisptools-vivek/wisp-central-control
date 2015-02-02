
Template.wtInteraction.helpers({
  pages: function () {
    return WtInteractionConfig.find({type: "schema", page: this.type}, {sort: {display_order: 1}});
  }
});

Template.wtInteraction.rendered = function () {
  // Activate the first tab.
  $('#wt_interaction_tabs a:first').tab('show');
}

Template.wtInteractionPageTab.helpers({
  pageId: function () {
    return this.page + this.display_order + "_id";
  }
});

Template.wtInteractionPageContent.helpers({
  pageId: function () {
    return this.page + this.display_order + "_id";
  },
  formId: function () {
    return this.page + this.display_order + "_autoform";
  },
  formSchema: function () {
    for (var key in this.schema) {
       if (this.schema.hasOwnProperty(key)) {
          if (this.schema[key].type === "String")
            this.schema[key].type = String;
          if (this.schema[key].type === "Number")
            this.schema[key].type = Number;
          if (this.schema[key].type === "Boolean")
            this.schema[key].type = Boolean;
       }
    }
    return new SimpleSchema(this.schema);;
  },
  parentData: function () {
    return Template.parentData();
  }
});

