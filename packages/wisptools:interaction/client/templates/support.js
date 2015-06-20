var pageData = [
  {
    tabName: "Support Page One",
    tabId: "support_page_one_page",
    tabTemplate: "wtInteractionQuickForm",
    schema: new SimpleSchema({
      q1: {
        type: String,
        label: "What seems to be the problem?",
        max: 60,
        optional: true
      }
    })
  },{
    tabName: "Support Page Two",
    tabId: "support_page_two_page",
    tabTemplate: "wtInteractionQuickForm",
    schema: new SimpleSchema({
      q2: {
        type: String,
        label: "Anything else?",
        max: 100,
        optional: true
      }
    })
  }
];

Template.wtInteractionSupport.helpers({
  pages: function () {
    // Setting the parent interaction data, so each page as access to the main context.
    for (i = 0; i < pageData.length; i++) {
      pageData[i].interactionData = Template.parentData(2).data;
    }
    return pageData;
  }
});