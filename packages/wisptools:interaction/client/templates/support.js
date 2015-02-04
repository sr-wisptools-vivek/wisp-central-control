var pageData = [
  {
    name: "Support Page One",
    pageId: "support_page_one_page",
    schema: new SimpleSchema({
      q1: {
        type: String,
        label: "What seems to be the problem?",
        max: 60,
        optional: true
      }
    })
  },{
    name: "Support Page Two",
    pageId: "support_page_two_page",
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
  pages: pageData
});